import { Injectable } from '@angular/core';
import { BoardLayout } from '../board/BoardLayout';
import { BusService } from '../bus/bus.service';
import { DomainModule } from '../domain.module';
import { DisposableCollection } from '../model/Disposable';
import { RoundConfig } from '../round/RoundConfig';
import { TeamConfig } from '../team/TeamConfig';
import { TeamLocation } from '../team/TeamLocation';
import { Game } from './game';
import { GameRepositoryService } from './game-repository.service';

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
  start(state: gameStartParam): void {
    const game = this.gameRepo.create(
      state.id,
      state.board,
      state.teams,
      state.round);
    this.gameRepo.put(game);
    //this.bus.publishParam(Topics.GameCreated, game.id);

    this._gameDisposables.empty();

    game.start();
  }
  public getById(id: string): Game | undefined {
    return this.gameRepo.get(id);
  }
  public handleMove(gameId: string, event: TeamMoveEvent): void {
    const game = this.getById(gameId);
    if (!game) {
      console.error("cannot move when game is not found");
      return;
    }
    game.handleMove(event);
  }
}

interface gameStartParam {
  readonly id: string;
  readonly board: BoardLayout;
  readonly teams: readonly TeamConfig[]
  readonly round: RoundConfig
}

export interface TeamMoveEvent {
  readonly teams: readonly {
    readonly id: string,
    readonly location: TeamLocation
  }[];
}

