import { BoardJson } from "src/app/board/BoardJson";

export interface GameStartConfig {
    readonly board: BoardJson;
    readonly teams: Team[];
}

export interface Team {
    readonly id: string;
    readonly location: TeamLocation;
}

export interface TeamLocation {
    readonly row: number;
    readonly column: number;
}
