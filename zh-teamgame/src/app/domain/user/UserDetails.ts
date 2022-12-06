import { ObjectiveConfig } from "../objective/objective";

export interface UserDetails {
    readonly id: string;
    readonly teamId: string;
    readonly objectives: readonly ObjectiveConfig[];
}
