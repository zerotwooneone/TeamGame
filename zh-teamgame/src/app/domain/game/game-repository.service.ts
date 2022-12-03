import { Injectable } from '@angular/core';
import { Board } from '../board/board';
import { BoardLayout } from '../board/BoardLayout';
import { DomainModule } from '../domain.module';
import { Pickup } from '../pickup/pickup';
import { PickupConfig } from '../pickup/PickupConfig';
import { Round } from '../round/round';
import { RoundConfig } from '../round/RoundConfig';
import { Team } from '../team/team';
import { TeamToken } from '../team/team-token';
import { TeamConfig } from '../team/TeamConfig';
import { Game, PickupByPickupId, TeamByTeamId } from './game';

@Injectable({
  providedIn: DomainModule
})
export class GameRepositoryService {
  private _game?: Game;
  create(
    id: string,
    boardLayout: BoardLayout,
    teams: readonly TeamConfig[],
    round: RoundConfig,
    pickups: readonly PickupConfig[]): Game {

    const pickupConfigbyPickupId = pickups.reduce((dict, pc) => {
      dict[pc.id] = pc;
      return dict;
    }, {} as { [pickupId: string]: PickupConfig });

    /**all pickups are isHeld=true */
    const pickupsHeldByTeams: { [pickupId: string]: Pickup } = {};

    const teamsParam = teams.map(c => {
      const pickup = !!c.token.pickupId
        ? function () {
          const pickupConfig = pickupConfigbyPickupId[c.token.pickupId];
          //all pickups on teams are isHeld=true
          const pickup = Pickup.Factory(pickupConfig.id, pickupConfig.shape, pickupConfig.color, pickupConfig.classes, true);
          pickupsHeldByTeams[pickup.id] = pickup;
          return pickup;
        }()
        : undefined;
      return Team.Factory(c.id, TeamToken.Factory(c.token.shape, c.token.color, c.token.location, pickup));
    });
    const teamByTeamId = teamsParam.reduce((dict, team) => {
      dict[team.id] = team;
      return dict;
    }, {} as TeamByTeamId);
    const pickupsParam = pickups.map(p => pickupsHeldByTeams[p.id] ?? Pickup.Factory(p.id, p.shape, p.color, p.classes, false));
    const pickupByPickupId = pickupsParam.reduce((dict, pickup) => {
      dict[pickup.id] = pickup;
      return dict;
    }, {} as PickupByPickupId);
    return Game.Factory(
      id,
      Board.Factory(boardLayout, teamByTeamId, pickupByPickupId),
      teamsParam,
      Round.Factory(
        round.id,
        round.end,
        round.maxActions
      ),
      pickupsParam);
  }
  put(game: Game): Promise<void> {
    this._game = game;
    return Promise.resolve();
  }
  get(id: string): Game | undefined {
    return this._game;
  }
}


