import { Injectable } from '@angular/core';
import { filter, take } from 'rxjs';
import { BoardService } from 'src/app/board/board.service';
import { DisposableCollection } from '../model/Disposable';
import { ObservableProperty, ObservablePropertyHelper } from '../model/ObservablePropertyHelper';
import { GameRepositoryService } from './game-repository.service';
import { GameStartConfig } from './GameStartConfig';
import { gameState } from './gameState';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly starting: ObservablePropertyHelper<void>;
  get starting$(): ObservableProperty<void> {
    return this.starting.property;
  }
  private readonly _gameDisposables: DisposableCollection;
  constructor(
    readonly gameRepo: GameRepositoryService,
    readonly boardService: BoardService) {
    this._gameDisposables = new DisposableCollection();
    this.starting = new ObservablePropertyHelper<void>();
  }
  create(id: string): void {
    const game = this.gameRepo.create(id);
    this.gameRepo.put(game);
  }
  async start(state: GameStartConfig): Promise<void> {
    const game = this.gameRepo.get();
    if (!game) {
      console.error("cannot start a game because the game doesn't exist");
      return;
    }
    this._gameDisposables.empty();

    this._gameDisposables.pushSubscription(game.gameState.observable$.pipe(
      filter(v => v >= gameState.started),
      take(1)
    ).subscribe(_ => {
      if (!game.boardConfig || !game.teams) {
        console.error("got a bad board config");
        return;
      }
      this.starting.next();
    }));
    game.start(state);
  }
}

