export interface BoardLayout {
    readonly rows: readonly ColumnArray[];
    readonly spaceSize: number;
}

export type ColumnArray = readonly SpaceDetails[];
export interface SpaceDetails {
    readonly impassible?: boolean;
}