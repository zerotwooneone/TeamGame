import { Injectable } from '@angular/core';
import { DomainModule } from '../domain.module';
import { GameService } from '../game/game.service';
import { RoundContext } from './round-context';

@Injectable({
  providedIn: DomainModule
})
export class RoundContextRepositoryService {
  private _context: RoundContext | undefined;
  constructor(
    private readonly gameService: GameService) { }
  public create(
    gameId: string,
    teamId: string): RoundContext {
    const game = this.gameService.getById(gameId);
    if (!game) {
      throw new Error("cannot start new round context. game was not found");
    }
    if (!game.round.assignable.hasBeenSet) {
      throw new Error("cannot start new round context. round was not set");
    }
    const team = game.teams[teamId];
    if (!team) {
      throw new Error(`cannot start round because team ${teamId} was not found`);
    }
    const context = RoundContext.Factory(
      game.round.assignable.value,
      0,
      team
    );
    return context;
  }
  get(): RoundContext | undefined {
    return this._context;
  }
  put(context: RoundContext): void {
    this._context = context;
  }
}
