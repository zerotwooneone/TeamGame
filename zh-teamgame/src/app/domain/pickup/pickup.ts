import { BehaviorSubject } from "rxjs";
import { Color, ColorFilter } from "../model/color";
import { ObservableProperty, ObservablePropertyHelper } from "../model/ObservablePropertyHelper";
import { PickupShapes, PickupShapeSource } from "./PickupShape";

export class Pickup {
    get classes(): readonly string[] {
        return this._classes;
    }
    get isHeld$(): ObservableProperty<boolean> {
        return this._isHeld$.property;
    }
    get canBePickedUp(): boolean {
        return this.isHeld$.assignable.hasBeenSet &&
            !this.isHeld$.assignable.value;
    }
    get canBePutDown(): boolean {
        return this.isHeld$.assignable.hasBeenSet &&
            this.isHeld$.assignable.value;
    }
    constructor(
        readonly id: string,
        readonly shape: PickupShapeSource,
        readonly color: ColorFilter,
        private readonly _classes: string[],
        private readonly _isHeld$: ObservablePropertyHelper<boolean>) { }
    public static Factory(
        id: string,
        shape: string,
        color: string,
        classes: string[] = [],
        isHeld: boolean = true): Pickup {
        const pickupShape = PickupShapes.toPickupShapeSource(shape);
        if (!pickupShape) {
            throw new Error(`invalid team shape:${shape}`);
        }
        const pickupColor = Color.ToColorFilter(color);
        if (!pickupColor) {
            throw new Error(`invalid team color:${color}`);
        }
        return new Pickup(
            id,
            pickupShape,
            pickupColor,
            classes,
            new ObservablePropertyHelper<boolean>(
                isHeld,
                new BehaviorSubject(isHeld)
            )
        );
    }
    public pickup(): void {
        if (!this.canBePickedUp) {
            console.warn(`cannot pickup:${this.id}`);
            return;
        }
        this._isHeld$.next(true);
    }
    public putDown(): void {
        if (!this.canBePutDown) {
            console.warn(`cannot putdown:${this.id}`);
            return;
        }
        this._isHeld$.next(false);
    }

}
