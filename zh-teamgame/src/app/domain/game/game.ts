import { Board } from "../board/board";
import { ObservableProperty, ObservablePropertyHelper } from "../model/ObservablePropertyHelper";
import { Team } from "../team/team";
import { gameState } from "./gameState";

export class Game {
    private readonly _gameState: ObservablePropertyHelper<gameState> = new ObservablePropertyHelper<gameState>(gameState.preStart);
    get gameState(): ObservableProperty<gameState> {
        return this._gameState.property;
    }
    constructor(
        readonly id: string,
        readonly board: Board,
        readonly teams: Team[]) { }

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
}


