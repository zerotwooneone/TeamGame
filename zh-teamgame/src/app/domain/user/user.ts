import { Objective } from "../objective/objective";

export class User {
    constructor(
        readonly id: string,
        readonly teamId: string,
        readonly objectives: readonly Objective[]) { }
    static Factory(
        id: string,
        teamId: string,
        objectives: readonly Objective[]): User {
        return new User(
            id,
            teamId,
            objectives
        );
    }
}
