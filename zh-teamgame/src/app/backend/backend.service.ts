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
  private readonly _teamUpdate$: Subject<TeamUpdate>;
  get teamUpdate$(): Observable<TeamUpdate> { return this._teamUpdate$.asObservable(); }
  private readonly _user$: Subject<UserDetails>;
  get user$(): Observable<UserDetails> { return this._user$.asObservable(); }
  get round$(): Observable<Round> { return this._round$.asObservable(); }
  get roundEnd$(): Observable<void> { return this._roundEnd$.asObservable(); }
  constructor(
    readonly httpClient: HttpClient,
  ) {
    this._starting$ = new Subject<GameStartState>();
    this._teamMove$ = new Subject<TeamMoveEvent>();
    this._teamUpdate$ = new Subject<TeamUpdate>();
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
        {
          id: "1", token: {
            shape: "Hexagon",
            color: "Blue",
            location: { row: 0, column: 1 }
          }
        },
        {
          id: "2", token: {
            shape: "Star",
            color: "Green",
            location: { row: 3, column: 4 },
            pickupId: "pickup3"
          }
        }
      ],
      round: {
        id: this.nextRoundId++,
        end: this.getRoundEnd(),
        maxActions: this.roundActions
      },
      pickups: [
        { id: "pickup1", color: "Red", shape: "Square", location: { row: 2, column: 1 }, classes: ["Red", "Square"] },
        { id: "pickup2", color: "Aqua", shape: "Spiral", location: { row: 0, column: 1 }, classes: ["Aqua", "Spiral"] },
        { id: "pickup3", color: "Magenta", shape: "Triangle", location: { row: 3, column: 4 }, classes: ["Magenta", "Triangle"] },
      ]
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
    const team1Positions: readonly BoardLocation[] = [
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
    this.lastTimestamp = 0;
    this._round$.next({
      id: this.nextRoundId++,
      end: this.getRoundEnd(),
      maxActions: this.roundActions
    });
  }

  /**
 * @deprecated This should only be used when faking data
 */
  mockUpdateActions(teamId: string, actions: readonly ActionDescription[], timeStamp: number) {
    const tsParam = timeStamp ?? (new Date().getTime());
    this._teamUpdate$.next({
      id: teamId,
      timeStamp: tsParam,
      actions: actions
    });
  }

  private lastTimestamp = 0;
  /**Sends user provided chages to the action list to the backend */
  public async updateActions(teamId: string, actions: ActionStateDescription): Promise<void> {
    const delayMs = 200;
    if (actions.timeStamp < this.lastTimestamp) {
      return;
    }
    this.lastTimestamp = actions.timeStamp;
    await new Promise((resolve) => setTimeout(() => resolve(1), delayMs));
    this._teamUpdate$.next({
      id: teamId,
      timeStamp: actions.timeStamp + delayMs,
      actions: actions.actions
    })
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
  readonly pickups: readonly PickupDesc[];
}

export interface PickupDesc {
  readonly id: string;
  readonly color: string;
  readonly shape: string;
  readonly classes: readonly string[];
  readonly location: BoardLocation;
}

interface Team {
  readonly id: string;
  readonly token: {
    readonly color: string;
    readonly shape: string;
    readonly location: BoardLocation;
    readonly pickupId?: string;
  }

}

interface BoardLocation {
  readonly row: number;
  readonly column: number;
}

export interface TeamUpdate {
  readonly id: string;
  readonly actions: readonly ActionDescription[];
  readonly pickupId?: string;
  readonly timeStamp: number;
}

export type ActionDescription = {
  move: ActionDirection;
  pickup?: undefined;
} | {
  move?: undefined;
  pickup: true;
}

type ActionDirection = "N" | "NE" | "NW" | "E" | "W" | "S" | "SE" | "SW";

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
    readonly location: BoardLocation
  }[];
}

export interface Round {
  readonly id: number;
  readonly end: Date;
  readonly maxActions: number;
}

export interface ActionStateDescription {
  readonly actions: readonly ActionDescription[];
  readonly timeStamp: number;
}
