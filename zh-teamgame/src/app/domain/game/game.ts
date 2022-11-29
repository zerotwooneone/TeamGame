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
    private readonly _teams: { [id: string]: Team };
    constructor(
        readonly id: string,
        readonly board: Board,
        teams: Team[]) {
        this._teams = teams.reduce((dict, team) => {
            dict[team.id] = team;
            return dict;
        }, {} as { [id: string]: Team })
    }

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
        return new Game(
            id,
            board,
            teams.map(i => i)
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
            this.board.moveTeam(newTeam.id, oldLocation, newTeam.location);
        }
    }
}


