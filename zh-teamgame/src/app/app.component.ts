import { Component, OnInit } from '@angular/core';
import { BackendService, GameStartState, Round, TeamMoveEvent, TeamUpdate, UserDetails } from './backend/backend.service';
import { GameService } from './domain/game/game.service';
import { DisposableCollection } from './domain/model/Disposable';
import { Game } from './domain/game/game';
import { UserService } from './domain/user/user.service';
import { User } from './domain/user/user';
import { RoundContextService } from './domain/round/round-context.service';
import { RoundContext } from './domain/round/round-context';
import { concatMap, filter, Observable, Subject, switchMap, take, takeUntil } from 'rxjs';
import { ActionState } from './domain/round/action-sequence';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'zh-teamgame';
  game?: Game;
  user?: User;
  roundContext?: RoundContext;
  private readonly _disposableCollection: DisposableCollection;
  constructor(
    readonly gameService: GameService,
    readonly backend: BackendService,
    readonly userService: UserService,
    readonly roundContextService: RoundContextService) {
    this._disposableCollection = new DisposableCollection();
  }
  async ngOnInit(): Promise<void> {

    this._disposableCollection.pushSubscription(
      this.roundContextService.roundContext$.subscribe(r => {
        return this.onRoundContext(r);
      })
    );

    this._disposableCollection.pushSubscription(
      this.backend.starting$
        .subscribe(s => this.OnStarting(s))
    );
    this._disposableCollection.pushSubscription(
      this.backend.user$
        .subscribe(s => this.OnUser(s))
    );

    this._disposableCollection.pushSubscription(
      this.backend.teamMove$
        .subscribe(s => this.OnMove(s))
    );
    this._disposableCollection.pushSubscription(
      this.backend.teamUpdate$
        .subscribe(s => this.OnTeamUpdate(s))
    );

    this._disposableCollection.pushSubscription(
      this.backend.roundEnd$
        .subscribe(s => {
          if (!this.game) {
            console.error("cannot end round. game is not set");
            return;
          }
          this.gameService.onRoundEnd(this.game.id);
        })
    );

    this._disposableCollection.pushSubscription(
      this.backend.round$.subscribe(s => this.OnRound(s))
    );

    this._disposableCollection.pushSubscription(
      this.actionsUpdated$.pipe(concatMap(async (actions) => {
        if (!this.user) {
          console.error("cannot update actions because there is no user");
          return;
        }
        return this.backend.updateActions(this.user.teamId, actions);
      })).subscribe()
    )


    //simulate the backend pushing a new game to us
    this.backend.bootStrapStart();

  }
  private readonly actionsUpdatedSubject = new Subject<Observable<ActionState>>;
  private readonly actionsUpdated$ = this.actionsUpdatedSubject.asObservable().pipe(switchMap(o => o));
  onRoundContext(context: RoundContext): void {
    this.roundContext = context;
    this.actionsUpdatedSubject.next(this.roundContext.actions.actions$.observable$);

    //todo: clear subscriptions after rounds
    this.roundContext.actions.submitted$.observable$.pipe(
      takeUntil(this.roundContextService.roundContext$),
      filter(b => b),
      take(1),
      concatMap(async _ => {
        if (!this.roundContext) {
          console.error("cannot submit because there is no round context")
          return;
        }
        return this.OnSubmitted(this.roundContext.team.id);
      })
    ).subscribe();
  }
  async OnSubmitted(teamId: string): Promise<void> {
    await this.backend.submit(teamId);
  }

  private OnStarting(state: GameStartState): void {
    this.gameService.start(state);
    const game = this.gameService.getById(state.id);
    if (!game) {
      throw new Error(`didn't find game with id:${state.id}`);
    }
    this.game = game;
    if (!this.user) {
      throw new Error("cant start the game because the user is null");
    }

    this._disposableCollection.push(
      this.roundContextService.BeginListening(
        game.id,
        this.user.teamId,
        game.round.observable$)
    );
  }

  private OnMove(event: TeamMoveEvent): void {
    if (!this.game) {
      console.error('cannot move when there is no game');
      return;
    }
    this.gameService.handleMove(this.game.id, event);
  }
  private OnTeamUpdate(s: TeamUpdate): void {
    if (!this.roundContext) {
      console.error('cannot update team when there is no round context');
      return;
    }
    this.roundContext.actions.update({ actions: s.actions, timeStamp: s.timeStamp });
  }

  private OnUser(user: UserDetails) {
    this.user = this.userService.init(user);
  }

  private OnRound(s: Round): void {
    if (!this.game) {
      console.error("cannot handle new round. game is not set");
      return;
    }
    this.gameService.onNewRound(this.game.id, s);

    if (!this.user) {
      throw new Error("cant start the game because the user is null");
    }
  }

}
