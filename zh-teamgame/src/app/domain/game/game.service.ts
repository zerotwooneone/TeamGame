import { Injectable } from '@angular/core';
import { filter, take } from 'rxjs';
import { BoardLayout } from '../board/BoardLayout';
import { DomainModule } from '../domain.module';
import { DisposableCollection } from '../model/Disposable';
import { ObservableProperty, ObservablePropertyHelper } from '../model/ObservablePropertyHelper';
import { TeamConfig } from '../team/TeamConfig';
import { GameRepositoryService } from './game-repository.service';
import { gameState } from './gameState';

@Injectable({
  providedIn: DomainModule
})
export class GameService {

  private readonly starting: ObservablePropertyHelper<void>;
  get starting$(): ObservableProperty<void> {
    return this.starting.property;
  }
  private readonly _gameDisposables: DisposableCollection;
  constructor(
    readonly gameRepo: GameRepositoryService) {
    this._gameDisposables = new DisposableCollection();
    this.starting = new ObservablePropertyHelper<void>();
  }
  async start(state: { readonly id: string, readonly board: BoardLayout, readonly teams: readonly TeamConfig[] }): Promise<void> {
    const game = this.gameRepo.create(
      state.id,
      state.board,
      state.teams);
    this.gameRepo.put(game);
    this._gameDisposables.empty();

    this._gameDisposables.pushSubscription(game.gameState.observable$.pipe(
      filter(v => v >= gameState.started),
      take(1)
    ).subscribe(_ => {
      if (!game.board || !game.teams) {
        console.error("got a bad board config");
        return;
      }
      this.starting.next();
    }));
    game.start();
  }
}

