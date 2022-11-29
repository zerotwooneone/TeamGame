import { Board } from "../board/board";
import { ObservableProperty, ObservablePropertyHelper } from "../model/ObservablePropertyHelper";
import { Team } from "../team/team";
import { TeamMoveEvent } from "./game.service";
import { gameState } from "./gameState";

export class Game {
    private readonly _gameState: ObservablePropertyHelper<gameState> = new ObservablePropertyHelper<gameState>(gameState.preStart);
    get gameState(): ObservableProperty<gameState> {
        return this._gameState.property;
    }
    get teams(): { readonly [id: string]: Team } {
        return this._teams;
    }
    constructor(
        readonly id: string,
        readonly board: Board,
        private readonly _teams: teamLookup) { }

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
        teams: readonly Team[]
    ): Game {
        const teamLookup = teams.reduce((dict, team) => {
            dict[team.id] = team;
            return dict;
        }, {} as teamLookup)
        return new Game(
            id,
            board,
            teamLookup
        )
    }
    public handleMove(event: TeamMoveEvent) {
        for (const newTeam of event.teams) {
            const team = this._teams[newTeam.id];
            if (!team) {
                console.error(`cannot move team that does not exist id:${newTeam.id}`);
                continue;
            }
            const oldLocation = team.location;
            team.move(newTeam.location);
            this.board.moveTeam({ id: newTeam.id, token: team.token }, oldLocation, newTeam.location);
        }
    }
}

type teamLookup = { [id: string]: Team };


