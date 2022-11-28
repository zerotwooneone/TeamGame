import { BoardLayout } from "src/app/board/BoardLayout";

export interface GameStartConfig {
    readonly id: string;
    readonly board: BoardLayout;
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
