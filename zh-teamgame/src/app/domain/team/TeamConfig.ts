import { TeamLocation } from "./TeamLocation";


export interface TeamConfig {
    readonly id: string;
    readonly location: TeamLocation;
    readonly token: string;
}
