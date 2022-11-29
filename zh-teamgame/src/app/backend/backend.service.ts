import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, firstValueFrom, from, interval, map, Observable, of, Subject, switchMap, take } from 'rxjs';
import { BackendModule } from './backend.module';

@Injectable({
  providedIn: BackendModule
})
export class BackendService {
  private _starting$: Subject<GameStartState>;
  get starting$(): Observable<GameStartState> { return this._starting$.asObservable(); }
  private _teamMove$: Subject<TeamMoveEvent>;
  get teamMove$(): Observable<TeamMoveEvent> { return this._teamMove$.asObservable(); }
  constructor(
    readonly httpClient: HttpClient,
  ) {
    this._starting$ = new Subject<GameStartState>();
    this._teamMove$ = new Subject<TeamMoveEvent>();
  }

  /**this is a placeholder that represents the backend pushing out a new game to us */
  public async bootStrapStart(): Promise<void> {
    const team1Id = "assets/team-tokens/snowflake-green.svg";
    const team1Positions: readonly TeamLocation[] = [
      { row: 0, column: 1 },
      { row: 0, column: 2 },
      { row: 1, column: 2 },
      { row: 0, column: 2 }
    ];
    const gameStartState: GameStartState = {
      id: "game id",
      board: await this.getBoardJson("board1"),
      teams: [
        { id: team1Id, location: team1Positions[0] },
        { id: "assets/team-tokens/stars.svg", location: { row: 3, column: 4 } }
      ]
    };


    this._starting$.next(gameStartState);
    const s = of("s").pipe(
      delay(1000),
      //take(1),
      switchMap(_ => interval(1000)),
      map(n => team1Positions[n % team1Positions.length]),
      map(l => {
        return { teams: [{ id: team1Id, location: l }] } as TeamMoveEvent;
      })
    ).subscribe(tme => this._teamMove$.next(tme));
    //await new Promise(resolve => setTimeout(() => resolve(1), 5000));
  }
  private async getBoardJson(token: string): Promise<Board> {
    return await firstValueFrom(this.httpClient.get<Board>(`assets/boards/${token}.json`));
  }

}

export interface GameStartState {
  readonly id: string;
  readonly board: Board;
  readonly teams: readonly Team[];
}

interface Team {
  readonly id: string;
  readonly location: TeamLocation;
}

interface TeamLocation {
  readonly row: number;
  readonly column: number;
}

export interface Board {
  readonly rows: readonly ColumnArray[];
  spaceSize: number;
}

type ColumnArray = readonly Space[];
interface Space {
  readonly impassible?: boolean;
}

export interface TeamMoveEvent {
  readonly teams: readonly {
    readonly id: string,
    readonly location: TeamLocation
  }[];
}
