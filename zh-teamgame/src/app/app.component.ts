import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';
import { BackendService, GameStartState } from './backend/backend.service';
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
      this.backend.starting$.pipe(
        switchMap(async s => await this.OnStarting(s))
      ).subscribe()
    );

    //simulate the backend pushing a new game to us
    this.backend.bootStrapStart();

  }
  private async OnStarting(state: GameStartState): Promise<void> {
    await this.gameService.start(state);
    const game = this.gameService.getById(state.id);
    if (!game) {
      throw new Error(`didn't find game with id:${state.id}`);
    }
    this.game = game;
  }

}
