import { TeamLocation } from "./TeamLocation";

export class Team {
    get location(): TeamLocation {
        return this._location;
    }
    constructor(
        readonly id: string,
        private _location: TeamLocation) { }
    public static Factory(
        id: string,
        location: TeamLocation): Team {
        return new Team(id, location);
    }
    public move(location: TeamLocation) {
        this._location = location;
    }
}


