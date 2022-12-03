import { BoardLocationConfig } from "../space/BoardLocation";

export interface PickupConfig {
    readonly id: string;
    readonly color: string;
    readonly shape: string;
    readonly classes: readonly string[];
    readonly location: BoardLocationConfig;
}
