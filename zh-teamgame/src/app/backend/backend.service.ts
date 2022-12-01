import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, firstValueFrom, interval, lastValueFrom, map, Observable, of, Subject, switchMap, take, tap } from 'rxjs';
import { BackendModule } from './backend.module';

@Injectable({
  providedIn: BackendModule
})
export class BackendService {
  private readonly _starting$: Subject<GameStartState>;
  private readonly _roundEnd$: Subject<void>;
  private readonly _round$: Subject<Round>;
  get starting$(): Observable<GameStartState> { return this._starting$.asObservable(); }
  private readonly _teamMove$: Subject<TeamMoveEvent>;
  get teamMove$(): Observable<TeamMoveEvent> { return this._teamMove$.asObservable(); }
  private readonly _user$: Subject<UserDetails>;
  get user$(): Observable<UserDetails> { return this._user$.asObservable(); }
  get round$(): Observable<Round> { return this._round$.asObservable(); }
  get roundEnd$(): Observable<void> { return this._roundEnd$.asObservable(); }
  constructor(
    readonly httpClient: HttpClient,
  ) {
    this._starting$ = new Subject<GameStartState>();
    this._teamMove$ = new Subject<TeamMoveEvent>();
    this._user$ = new Subject<UserDetails>();
    this._roundEnd$ = new Subject<void>();
    this._round$ = new Subject<Round>();
  }

  /**this is a placeholder that represents the backend pushing out a new game to us */
  public async bootStrapStart(): Promise<void> {
    const user = await this.getUser();
    this._user$.next(user);

    const gameStartState: GameStartState = {
      id: "game id",
      board: await this.getBoard("board1"),
      teams: [
        { id: "1", token: "assets/team-tokens/snowflake-green.svg", location: { row: 0, column: 1 } },
        { id: "2", token: "assets/team-tokens/stars.svg", location: { row: 3, column: 4 } }
      ],
      round: {
        id: this.nextRoundId++,
        end: this.getRoundEnd(),
        maxActions: this.roundActions
      }
    };


    this._starting$.next(gameStartState);

  }
  private nextRoundId = 1;
  private readonly roundActions = 5;

  private getRoundEnd(roundMinutes = 5): Date {
    return new Date((new Date().getTime()) + roundMinutes * 60000);
  }

  private async getBoard(token: string): Promise<Board> {
    return await firstValueFrom(this.httpClient.get<Board>(`assets/boards/${token}.json`));
  }
  private async getUser(): Promise<UserDetails> {
    return await firstValueFrom(this.httpClient.get<UserDetails>(`assets/mock/user.json`));
  }
  endRound(): void {
    this._roundEnd$.next();

    //simulate team movement
    const team1Id = "1";
    const team1Positions: readonly TeamLocation[] = [
      { row: 0, column: 1 },
      { row: 0, column: 2 },
      { row: 1, column: 2 },
      { row: 0, column: 2 }
    ];
    lastValueFrom(of("s").pipe(
      delay(1000),
      switchMap(_ => interval(1000)),
      map(n => team1Positions[n % team1Positions.length]),
      map(l => {
        return { teams: [{ id: team1Id, location: l }] } as TeamMoveEvent;
      }),
      take(9),
      tap(tme => this._teamMove$.next(tme))
    ));
  }
  startNewRound(): void {
    this._round$.next({
      id: this.nextRoundId++,
      end: this.getRoundEnd(),
      maxActions: this.roundActions
    });
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
