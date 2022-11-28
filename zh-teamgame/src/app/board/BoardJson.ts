
export interface BoardJson {
    readonly rows: readonly ColumnArray[];
    spaceSize: number;
}

export type ColumnArray = readonly SpaceJson[];
export interface SpaceJson {
    readonly impassible?: boolean;
}
