import { Color, ColorFilter } from "../model/color";
import { Pickup } from "../pickup/pickup";
import { BoardLocationConfig } from "../space/BoardLocation";
import { CommonShapes, ShapePath } from "../model/CommonShape";

export class TeamToken {
    get location(): BoardLocationConfig {
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
        readonly shape: ShapePath,
        readonly color: ColorFilter,
        private _location: BoardLocationConfig,
        private _pickup?: Pickup
    ) { }
    public static Factory(
        shape: string,
        color: string,
        teamLocation: BoardLocationConfig,
        pickup?: Pickup
    ): TeamToken {
        const teamShape = CommonShapes.toShapePath(shape);
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
    public move(location: BoardLocationConfig) {
        this._location = location;
    }
    public addPickup(pickup: Pickup): void {
        if (!this.canPickup) {
            console.warn(`cannot pickup`, pickup);
            return;
        }
        this._pickup = pickup;
    }
    public removePickup(): Pickup | undefined {
        if (!this.canPutDown) {
            console.warn(`cannot put down`);
            return this._pickup;
        }
        const result = this._pickup;
        this._pickup = undefined;
        return result;
    }
}


