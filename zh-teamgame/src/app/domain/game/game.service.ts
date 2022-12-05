import { Injectable } from '@angular/core';
import { BoardLayout } from '../board/BoardLayout';
import { BusService } from '../bus/bus.service';
import { Topics } from '../bus/topics';
import { DomainModule } from '../domain.module';
import { DisposableCollection } from '../model/Disposable';
import { Round } from '../round/round';
import { RoundConfig } from '../round/RoundConfig';
import { TeamConfig } from '../team/TeamConfig';
import { BoardLocationConfig } from '../space/BoardLocation';
import { Game } from './game';
import { GameRepositoryService } from './game-repository.service';
import { PickupConfig } from '../pickup/PickupConfig';

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
      state.round,
      state.pickups);
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
    game.handleAction(event);
  }

  public onRoundEnd(gameId: string) {
    const game = this.getById(gameId);
    if (!game) {
      console.error("cannot end round. game was not found");
      return;
    }
    if (!game.round.assignable.hasBeenSet) {
      console.error("cannot end round. round is not set");
      return;
    }
    game.round.assignable.value.endRound();
  }

  public onNewRound(
    gameId: string,
    config: RoundConfig): void {
    const game = this.getById(gameId);
    if (!game) {
      console.error("cannot start new round. game was not found");
      return;
    }
    const round = Round.Factory(
      config.id,
      config.end,
      config.maxActions
    );
    game.newRound(round);
  }
}

interface gameStartParam {
  readonly id: string;
  readonly board: BoardLayout;
  readonly teams: readonly TeamConfig[];
  readonly round: RoundConfig;
  readonly pickups: readonly PickupConfig[];
}

type TeamAction = {
  readonly id: string;
  readonly location: BoardLocationConfig;
  readonly pickup?: undefined;
} |
{
  readonly id: string;
  readonly location?: undefined;
  readonly pickup?: true;
};

export interface TeamMoveEvent {
  readonly teams: readonly TeamAction[];
}

