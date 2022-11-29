import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, Subject } from 'rxjs';
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
    const gameStartState: GameStartState = {
      id: "game id",
      board: await this.getBoardJson("board1"),
      teams: [
        { id: "assets/team-tokens/snowflake-green.svg", location: { row: 0, column: 1 } },
        { id: "assets/team-tokens/stars.svg", location: { row: 3, column: 4 } }
      ]
    };
    this._starting$.next(gameStartState);
    //this._teamMove$.next(gameStartState);
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
