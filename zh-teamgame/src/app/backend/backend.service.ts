import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, firstValueFrom, from, interval, map, Observable, of, Subject, switchMap, take } from 'rxjs';
import { BackendModule } from './backend.module';

@Injectable({
  providedIn: BackendModule
})
export class BackendService {
  private readonly _starting$: Subject<GameStartState>;
  get starting$(): Observable<GameStartState> { return this._starting$.asObservable(); }
  private readonly _teamMove$: Subject<TeamMoveEvent>;
  get teamMove$(): Observable<TeamMoveEvent> { return this._teamMove$.asObservable(); }
  private readonly _user$: Subject<UserDetails>;
  get user$(): Observable<UserDetails> { return this._user$.asObservable(); }
  constructor(
    readonly httpClient: HttpClient,
  ) {
    this._starting$ = new Subject<GameStartState>();
    this._teamMove$ = new Subject<TeamMoveEvent>();
    this._user$ = new Subject<UserDetails>();
  }

  /**this is a placeholder that represents the backend pushing out a new game to us */
  public async bootStrapStart(): Promise<void> {
    const user = await this.getUser();
    this._user$.next(user);

    const team1Id = "1";
    const team1Positions: readonly TeamLocation[] = [
      { row: 0, column: 1 },
      { row: 0, column: 2 },
      { row: 1, column: 2 },
      { row: 0, column: 2 }
    ];
    const roundMinutes = 5;
    const gameStartState: GameStartState = {
      id: "game id",
      board: await this.getBoard("board1"),
      teams: [
        { id: team1Id, token: "assets/team-tokens/snowflake-green.svg", location: team1Positions[0] },
        { id: "2", token: "assets/team-tokens/stars.svg", location: { row: 3, column: 4 } }
      ],
      round: {
        id: 1,
        end: new Date((new Date().getTime()) + roundMinutes * 60000),
        maxActions: 5
      }
    };


    this._starting$.next(gameStartState);
    const s = of("s").pipe(
      delay(1000),
      switchMap(_ => interval(1000)),
      map(n => team1Positions[n % team1Positions.length]),
      map(l => {
        return { teams: [{ id: team1Id, location: l }] } as TeamMoveEvent;
      })
    ).subscribe(tme => this._teamMove$.next(tme));
    //await new Promise(resolve => setTimeout(() => resolve(1), 5000));
  }
  private async getBoard(token: string): Promise<Board> {
    return await firstValueFrom(this.httpClient.get<Board>(`assets/boards/${token}.json`));
  }
  private async getUser(): Promise<UserDetails> {
    return await firstValueFrom(this.httpClient.get<UserDetails>(`assets/mock/user.json`));
  }
  startNewRound() {
    throw new Error('Method not implemented.');

    /*Round.Factory(
      1,
      new Date((new Date().getTime()) + roundMinutes * 60000),
      5
    )*/
  }

}

export interface UserDetails {
  readonly id: string;
  readonly teamId: string;
}

export interface GameStartState {
  readonly id: string;
  readonly board: Board;
  readonly teams: readonly Team[];
  readonly round: Round;
}

interface Team {
  readonly id: string;
  readonly token: string;
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

export interface Round {
  readonly id: number;
  readonly end: Date;
  readonly maxActions: number;
}
