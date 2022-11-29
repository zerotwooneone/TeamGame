import { Injectable } from '@angular/core';
import { Board } from '../board/board';
import { BoardLayout } from '../board/BoardLayout';
import { DomainModule } from '../domain.module';
import { Round } from '../round/round';
import { RoundConfig } from '../round/RoundConfig';
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
    teams: readonly TeamConfig[],
    round: RoundConfig): Game {
    const teamTokenLookup = teams.reduce((dict, team) => {
      dict[team.id] = team.token;
      return dict;
    }, {} as { [id: string]: string });

    const roundMinutes = 5;
    return Game.Factory(
      id,
      Board.Factory(boardLayout, teamTokenLookup),
      teams.map(c => Team.Factory(c.id, c.location, c.token)),
      Round.Factory(
        round.id,
        round.end,
        round.maxActions
      ));
  }
  put(game: Game): Promise<void> {
    this._game = game;
    return Promise.resolve();
  }
  get(id: string): Game | undefined {
    return this._game;
  }
}


