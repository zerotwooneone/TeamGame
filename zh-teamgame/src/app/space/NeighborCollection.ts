import { NeighborInfo } from "./NeighborInfo";


export interface NeighborCollection {
    readonly N: NeighborInfo;
    readonly NE: NeighborInfo;
    readonly NW: NeighborInfo;

    readonly E: NeighborInfo;
    readonly W: NeighborInfo;

    readonly S: NeighborInfo;
    readonly SE: NeighborInfo;
    readonly SW: NeighborInfo;
}
