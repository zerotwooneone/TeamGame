import { TeamLocation } from "./TeamLocation";

export class Team {
    get location(): TeamLocation {
        return this._location;
    }
    constructor(
        readonly id: string,
        private _location: TeamLocation,
        readonly token: string) { }
    public static Factory(
        id: string,
        location: TeamLocation,
        token: string): Team {
        return new Team(id, location, token);
    }
    public move(location: TeamLocation) {
        this._location = location;
    }
}


