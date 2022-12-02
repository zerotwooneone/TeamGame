import { TeamToken } from "./team-token";

export class Team {
    constructor(
        readonly id: string,
        readonly token: TeamToken) { }
    public static Factory(
        id: string,
        token: TeamToken): Team {
        return new Team(id, token);
    }
}


