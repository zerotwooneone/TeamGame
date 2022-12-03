import { Color, ColorFilter } from "../model/color";
import { Pickup } from "../pickup/pickup";
import { TeamLocation } from "./TeamLocation";
import { TeamShapes, TeamShapeSource } from "./TeamShape";

export class TeamToken {
    get location(): TeamLocation {
        return this._location;
    }
    get heldPickup(): Pickup | undefined {
        return this._pickup;
    }
    get canPickup(): boolean {
        return !this.heldPickup;
    }
    get canPutDown(): boolean {
        return !!this.heldPickup;
    }
    constructor(
        readonly shape: TeamShapeSource,
        readonly color: ColorFilter,
        private _location: TeamLocation,
        private _pickup?: Pickup
    ) { }
    public static Factory(
        shape: string,
        color: string,
        teamLocation: TeamLocation,
        pickup?: Pickup
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
            teamLocation,
            pickup
        );
    }
    public move(location: TeamLocation) {
        this._location = location;
    }
    public pickup(pickup: Pickup): void {
        if (!this.canPickup) {
            console.warn(`cannot pickup`, pickup);
            return;
        }
        this._pickup = pickup;
    }
    public putdown(): void {
        if (!this.canPutDown) {
            console.warn(`cannot put down`);
            return;
        }
        this._pickup = undefined;
    }
}


