import { Injectable } from '@angular/core';
import { Board } from '../board/board';
import { BoardLayout } from '../board/BoardLayout';
import { DomainModule } from '../domain.module';
import { Team } from '../team/team';
import { TeamConfig } from '../team/TeamConfig';
import { Game } from './game';

@Injectable({
  providedIn: DomainModule
})
export class GameRepositoryService {
  private _game?: Game;
  create(
    id: string,
    boardLayout: BoardLayout,
    teamConfig: readonly TeamConfig[]): Game {
    return Game.Factory(
      id,
      Board.Factory(boardLayout),
      teamConfig.map(c => Team.Factory(c.id, c.location)));
  }
  put(game: Game): Promise<void> {
    this._game = game;
    return Promise.resolve();
  }
  get(): Game | undefined {
    return this._game;
  }
}
