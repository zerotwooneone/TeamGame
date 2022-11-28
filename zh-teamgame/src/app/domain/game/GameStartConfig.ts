import { BoardJson } from "src/app/board/BoardJson";

export interface GameStartConfig {
    readonly id: string;
    readonly board: BoardJson;
    readonly teams: readonly Team[];
}

export interface Team {
    readonly id: string;
    readonly location: TeamLocation;
}

export interface TeamLocation {
    readonly row: number;
    readonly column: number;
}
