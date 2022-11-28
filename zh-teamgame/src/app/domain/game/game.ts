import { BoardJson } from "src/app/board/BoardJson";
import { ObservableProperty, ObservablePropertyHelper } from "../model/ObservablePropertyHelper";
import { GameStartConfig, Team as ConfigTeam } from "./GameStartConfig";
import { gameState } from "./gameState";
import { ReadonlyTeam, Team } from "./Team";

export class Game {
    private readonly _gameState: ObservablePropertyHelper<gameState> = new ObservablePropertyHelper<gameState>(gameState.preStart);
    get gameState(): ObservableProperty<gameState> {
        return this._gameState.property;
    }
    private _teams?: readonly Team[];
    get teams(): readonly ReadonlyTeam[] | undefined {
        return this._teams as ReadonlyTeam[];
    }
    private _boardConfig?: BoardJson;
    get boardConfig(): BoardJson | undefined {
        return this._boardConfig;
    }
    constructor(readonly id: string) { }

    public start(config: GameStartConfig): void {
        if (!this.gameState.assignable.hasBeenSet || (this.gameState.assignable.value > gameState.preStart)) {
            console.error("game state is not startable");
            return;
        }
        this._teams = this.createTeams(config.teams);
        this._boardConfig = config.board;

        this._gameState.next(gameState.started);
    }

    private createTeams(configTeams: readonly ConfigTeam[]): Team[] {
        return configTeams.map(t => Object.assign({}, t));
    }
}


