import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';
import { BackendService, GameStartState, TeamMoveEvent } from './backend/backend.service';
import { GameService } from './domain/game/game.service';
import { DisposableCollection } from './domain/model/Disposable';
import { Game } from './domain/game/game';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'zh-teamgame';
  game?: Game;
  private readonly _disposableCollection: DisposableCollection;
  constructor(
    readonly gameService: GameService,
    readonly backend: BackendService) {
    this._disposableCollection = new DisposableCollection();
  }
  async ngOnInit(): Promise<void> {

    this._disposableCollection.pushSubscription(
      this.backend.starting$
        .subscribe(s => this.OnStarting(s))
    );

    this._disposableCollection.pushSubscription(
      this.backend.teamMove$
        .subscribe(s => this.OnMove(s))
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
  }

  private OnMove(event: TeamMoveEvent): void {
    if (!this.game) {
      console.error('cannot move when there is no game');
      return;
    }
    this.gameService.handleMove(this.game.id, event);
  }

}
