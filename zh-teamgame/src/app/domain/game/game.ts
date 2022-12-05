import { BehaviorSubject } from "rxjs";
import { Board } from "../board/board";
import { ObservableProperty, ObservablePropertyHelper } from "../model/ObservablePropertyHelper";
import { Pickup } from "../pickup/pickup";
import { Round } from "../round/round";
import { Team } from "../team/team";
import { TeamMoveEvent as TeamActionEvent } from "./game.service";
import { gameState } from "./gameState";

export class Game {
    private readonly _gameState: ObservablePropertyHelper<gameState> = new ObservablePropertyHelper<gameState>(gameState.preStart);
    get gameState(): ObservableProperty<gameState> {
        return this._gameState.property;
    }
    get teams(): Readonly<TeamByTeamId> {
        return this._teams;
    }
    get round(): ObservableProperty<Round> {
        return this._round.property;
    }
    get pickups(): Readonly<PickupByPickupId> {
        return this._pickups;
    }
    constructor(
        readonly id: string,
        readonly board: Board,
        private readonly _teams: TeamByTeamId,
        private readonly _round: ObservablePropertyHelper<Round>,
        private readonly _pickups: PickupByPickupId) { }

    public start(): void {
        if (!this.gameState.assignable.hasBeenSet || (this.gameState.assignable.value > gameState.preStart)) {
            console.error("game state is not startable");
            return;
        }
        this._gameState.next(gameState.started);
    }

    public static Factory(
        id: string,
        board: Board,
        teams: readonly Team[],
        round: Round,
        pickups: readonly Pickup[]
    ): Game {
        const teamByTeamId = teams.reduce((dict, team) => {
            dict[team.id] = team;
            return dict;
        }, {} as TeamByTeamId);
        const pickupByPickupId = pickups.reduce((dict, pickup) => {
            dict[pickup.id] = pickup;
            return dict;
        }, {} as PickupByPickupId)
        return new Game(
            id,
            board,
            teamByTeamId,
            new ObservablePropertyHelper<Round>(
                round,
                new BehaviorSubject<Round>(round)
            ),
            pickupByPickupId
        )
    }
    public handleAction(event: TeamActionEvent) {
        for (const teamAction of event.teams) {
            const team = this._teams[teamAction.id];
            if (!team) {
                console.error(`cannot move team that does not exist id:${teamAction.id}`);
                continue;
            }
            if (teamAction.pickup) {
                this.handlePickupAction(team);

            }
            else if (teamAction.location) {
                this.board.moveTeam({ id: teamAction.id, token: team.token }, teamAction.location);
            }
        }
    }
    handlePickupAction(team: Team) {
        const spaceHasPickup = this.board.hasPickup(team.token.location);
        const teamHasPickup = !!team.token.heldPickup;
        if ((spaceHasPickup && teamHasPickup) ||
            (!spaceHasPickup && !teamHasPickup)) {
            //this._pickupCollision$.next(team.id);
            return;
        }
        if (spaceHasPickup) {
            const pickup = this.board.removePickup(team.token.location);
            if (!pickup) {
                console.error(`pickup not found at`, team.token.location);
                return;
            }
            if (!team.token.canPickup) {
                console.error(`team ${team.id} cannot pickup`, team.token.location);
                this.board.addPickup(pickup, team.token.location);
                return;
            }
            team.token.addPickup(pickup);
            return;
        }

        //team has pickup
        if (!team.token.canPutDown) {
            console.error(`team ${team.id} cannot put down`, team.token.location);
            return;
        }
        const pickup = team.token.removePickup();
        if (!pickup) {
            console.error(`pickup does not exist on team ${team.id}`);
            return;
        }
        this.board.addPickup(pickup, team.token.location);
    }
    public newRound(round: Round) {
        this._round.next(round);
    }
}

type TeamByTeamId = { [teamId: string]: Team };
type PickupByPickupId = { [pickupId: string]: Pickup };


