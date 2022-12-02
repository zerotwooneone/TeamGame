import { TeamLocation } from "./TeamLocation";

export interface TeamConfig {
    readonly id: string;
    readonly token: {
        readonly location: TeamLocation;
        readonly shape: string;
        readonly color: string;
    }
}
