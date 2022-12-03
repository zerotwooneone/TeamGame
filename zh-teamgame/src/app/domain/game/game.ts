import { BehaviorSubject } from "rxjs";
import { Board } from "../board/board";
import { ObservableProperty, ObservablePropertyHelper } from "../model/ObservablePropertyHelper";
import { Pickup } from "../pickup/pickup";
import { Round } from "../round/round";
import { Team } from "../team/team";
import { TeamMoveEvent } from "./game.service";
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
    public handleMove(event: TeamMoveEvent) {
        for (const newTeam of event.teams) {
            const team = this._teams[newTeam.id];
            if (!team) {
                console.error(`cannot move team that does not exist id:${newTeam.id}`);
                continue;
            }
            team.token.move(newTeam.location);
            this.board.moveTeam({ id: newTeam.id, token: team.token }, newTeam.location);
        }
    }
    public newRound(round: Round) {
        this._round.next(round);
    }
}

export type TeamByTeamId = { [teamId: string]: Team };
export type PickupByPickupId = { [pickupId: string]: Pickup };


