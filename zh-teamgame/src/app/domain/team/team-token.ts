import { Color, ColorFilter } from "../model/color";
import { TeamLocation } from "./TeamLocation";
import { TeamShapes, TeamShapeSource } from "./TeamShape";

export class TeamToken {
    get location(): TeamLocation {
        return this._location;
    }
    constructor(
        readonly shape: TeamShapeSource,
        readonly color: ColorFilter,
        private _location: TeamLocation
    ) { }
    public static Factory(
        shape: string,
        color: string,
        teamLocation: TeamLocation
    ): TeamToken {
        const teamShape = TeamShapes.toTeamShapeSource(shape);
        if (!teamShape) {
            throw new Error(`invalid team shape:${shape}`);
        }
        const teamColor = Color.ToColorFilter(color);
        if (!teamColor) {
            throw new Error(`invalid team color:${color}`);
        }
        return new TeamToken(
            teamShape,
            teamColor,
            teamLocation
        );
    }
    public move(location: TeamLocation) {
        this._location = location;
    }
}


