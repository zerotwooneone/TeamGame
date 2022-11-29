import { Injectable } from '@angular/core';
import { filter, take } from 'rxjs';
import { BoardLayout } from '../board/BoardLayout';
import { BusService } from '../bus/bus.service';
import { Topics } from '../bus/topics';
import { DomainModule } from '../domain.module';
import { DisposableCollection } from '../model/Disposable';
import { ObservableProperty, ObservablePropertyHelper } from '../model/ObservablePropertyHelper';
import { TeamConfig } from '../team/TeamConfig';
import { Game } from './game';
import { GameRepositoryService } from './game-repository.service';
import { gameState } from './gameState';

@Injectable({
  providedIn: DomainModule
})
export class GameService {

  private readonly _gameDisposables: DisposableCollection;
  constructor(
    readonly gameRepo: GameRepositoryService,
    readonly bus: BusService) {
    this._gameDisposables = new DisposableCollection();
  }
  async start(state: { readonly id: string, readonly board: BoardLayout, readonly teams: readonly TeamConfig[] }): Promise<void> {
    const game = this.gameRepo.create(
      state.id,
      state.board,
      state.teams);
    this.gameRepo.put(game);
    //this.bus.publishParam(Topics.GameCreated, game.id);

    this._gameDisposables.empty();

    game.start();
  }
  public getById(id: string): Game | undefined {
    return this.gameRepo.get(id);
  }
}

