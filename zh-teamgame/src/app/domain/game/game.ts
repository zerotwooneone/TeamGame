import { BehaviorSubject } from "rxjs";
import { Board } from "../board/board";
import { ObservableProperty, ObservablePropertyHelper } from "../model/ObservablePropertyHelper";
import { Round } from "../round/round";
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
    get round(): ObservableProperty<Round> {
        return this._round.property;
    }
    constructor(
        readonly id: string,
        readonly board: Board,
        private readonly _teams: teamLookup,
        private readonly _round: ObservablePropertyHelper<Round>) { }

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
        round: Round
    ): Game {
        const teamLookup = teams.reduce((dict, team) => {
            dict[team.id] = team;
            return dict;
        }, {} as teamLookup)
        return new Game(
            id,
            board,
            teamLookup,
            new ObservablePropertyHelper<Round>(
                round,
                new BehaviorSubject<Round>(round)
            )
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
    public newRound(round: Round) {
        this._round.next(round);
    }
}

type teamLookup = { [id: string]: Team };


