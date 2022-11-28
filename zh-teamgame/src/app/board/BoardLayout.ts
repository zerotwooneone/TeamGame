
export interface BoardLayout {
    readonly rows: readonly ColumnArray[];
}

export type ColumnArray = readonly SpaceJson[];
export interface SpaceJson {
    readonly impassible?: boolean;
}
