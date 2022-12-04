import { Injectable } from '@angular/core';
import { Board, PickupByBoardLocation, TeamByBoardLocation } from '../board/board';
import { BoardLayout } from '../board/BoardLayout';
import { DomainModule } from '../domain.module';
import { Pickup } from '../pickup/pickup';
import { PickupConfig } from '../pickup/PickupConfig';
import { Round } from '../round/round';
import { RoundConfig } from '../round/RoundConfig';
import { BoardLocationConfig } from '../space/BoardLocation';
import { Team } from '../team/team';
import { TeamToken } from '../team/team-token';
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
    round: RoundConfig,
    pickups: readonly PickupConfig[]): Game {

    const pickupConfigbyPickupId = pickups.reduce((dict, pc) => {
      dict[pc.id] = pc;
      return dict;
    }, {} as { [pickupId: string]: PickupConfig });

    /**all pickups are isHeld=true */
    const pickupsHeldByTeams: { [pickupId: string]: Pickup } = {};

    const locationByTeamId: { [teamId: string]: BoardLocationConfig } = {};
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
      locationByTeamId[c.id] = c.token.location;
      return Team.Factory(c.id, TeamToken.Factory(c.token.shape, c.token.color, c.token.location, pickup));
    });
    const teamByBoardLocation = teamsParam.reduce((dict, team) => {
      const location = locationByTeamId[team.id];
      if (!location) {
        console.error(`could not find location for team:${team.id}`);
        return dict;
      }
      if (!dict[location.row]) {
        dict[location.row] = {};
      }
      dict[location.row][location.column] = team;
      return dict;
    }, {} as TeamByBoardLocation);
    const pickupsNotHeld: { [pickupId: string]: { readonly pickup: Pickup, readonly rowIndex: number, readonly columnIndex: number } } = {};
    const pickupsParam = pickups.map(p => {
      const heldPickup = pickupsHeldByTeams[p.id];
      if (heldPickup) {
        //dont create new pickup if we already created one, return the old one
        return heldPickup;
      }
      const newPickup = Pickup.Factory(p.id, p.shape, p.color, p.classes, false);
      pickupsNotHeld[newPickup.id] = { pickup: newPickup, rowIndex: p.location.row, columnIndex: p.location.column };
      return newPickup;
    });
    const pickupByBoardLocation = Object.values(pickupsNotHeld).reduce((dict, pickupWithLocation) => {
      if (!dict[pickupWithLocation.rowIndex]) {
        dict[pickupWithLocation.rowIndex] = {};
      }
      dict[pickupWithLocation.rowIndex][pickupWithLocation.columnIndex] = pickupWithLocation.pickup;
      return dict;
    }, {} as PickupByBoardLocation);
    return Game.Factory(
      id,
      Board.Factory(boardLayout, teamByBoardLocation, pickupByBoardLocation),
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


