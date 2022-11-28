export interface BoardLayout {
    readonly rows: readonly ColumnArray[];
}

export type ColumnArray = readonly SpaceDetails[];
export interface SpaceDetails {
    readonly impassible?: boolean;
}