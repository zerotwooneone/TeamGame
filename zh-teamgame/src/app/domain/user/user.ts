export class User {
    constructor(
        readonly id: string,
        readonly teamId: string) { }
    static Factory(
        id: string,
        teamId: string): User {
        return new User(
            id,
            teamId
        );
    }
}
