import { Component, OnInit } from '@angular/core';
import { BackendService, GameStartState, Round, TeamMoveEvent, TeamUpdate, UserDetails } from './backend/backend.service';
import { GameService } from './domain/game/game.service';
import { DisposableCollection } from './domain/model/Disposable';
import { Game } from './domain/game/game';
import { UserService } from './domain/user/user.service';
import { User } from './domain/user/user';
import { RoundContextService } from './domain/round/round-context.service';
import { Observable } from 'rxjs';
import { RoundContext } from './domain/round/round-context';

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

    this._disposableCollection.push(
      this.roundContextService.BeginListening()
    );
    this._disposableCollection.pushSubscription(
      this.roundContextService.roundContext$.subscribe(r => this.roundContext = r)
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

    //simulate the backend pushing a new game to us
    this.backend.bootStrapStart();

  }

  private OnStarting(state: GameStartState): void {
    this.gameService.start(state);
    const game = this.gameService.getById(state.id);
    if (!game) {
      throw new Error(`didn't find game with id:${state.id}`);
    }
    this.game = game;

    //we have to prime the first context
    this.roundContextService.OnNewRound(this.game.id);
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
    if (!this.roundContext.actions.assignable.hasBeenSet) {
      console.error('cannot update team when actions has not been set');
      return;
    }
    this.roundContext.actions.assignable.value.update(s.actions, s.timeStamp);
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
  }

}
