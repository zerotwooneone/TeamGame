export interface BoardLayout {
    readonly rows: readonly ColumnArray[];
    readonly spaceSize: number;
}

export type ColumnArray = readonly SpaceDetails[];
export interface SpaceDetails {
    readonly impassible?: boolean;
    /**(optional) the id of the team in this space*/
    readonly teamId?: string;
    /**(optional) the id of the pickup in this space */
    readonly pickupId?: string;
}