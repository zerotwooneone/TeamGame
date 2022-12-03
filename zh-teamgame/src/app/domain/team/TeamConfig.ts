import { BoardLocationConfig } from "../space/BoardLocation";

export interface TeamConfig {
    readonly id: string;
    readonly token: {
        readonly location: BoardLocationConfig;
        readonly shape: string;
        readonly color: string;
        readonly pickupId?: string;
    }
}
