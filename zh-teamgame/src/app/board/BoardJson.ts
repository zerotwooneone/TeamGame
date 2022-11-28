
export interface BoardJson {
    rows: ColumnArray[];
    spaceSize: number;
}

export type ColumnArray = SpaceJson[];
export interface SpaceJson {
    impassible?: boolean;
}
