import { BehaviorSubject } from "rxjs";
import { NullableObservableProperty, NullableObservablePropertyHelper } from "../model/ObservablePropertyHelper";
import { Pickup } from "../pickup/pickup";
import { Team } from "../team/team";

export class Space {
    get passible(): boolean {
        return this._passible;
    }
    get team$(): NullableObservableProperty<Team> {
        return this._team$.property;
    }
    get pickup$(): NullableObservableProperty<Pickup> {
        return this._pickup$.property;
    }
    get canPickup(): boolean {
        return this.pickup$.nullable.hasBeenSet &&
            !!this.pickup$.nullable.value;
    }
    get canPutdown(): boolean {
        return this.pickup$.nullable.hasBeenSet &&
            !this.pickup$.nullable.value;
    }
    constructor(
        private _passible: boolean,
        private readonly _team$: NullableObservablePropertyHelper<Team>,
        private readonly _pickup$: NullableObservablePropertyHelper<Pickup>) { }
    public static Factory(
        passible: boolean,
        team?: Team | null,
        pickup?: Pickup | null): Space {
        const teamParam = team ?? null;
        const teamHelper = new NullableObservablePropertyHelper<Team>(
            teamParam,
            new BehaviorSubject<Team | null>(teamParam));
        const pickupParam = pickup ?? null;
        const pickupHelper = new NullableObservablePropertyHelper<Pickup>(
            pickupParam,
            new BehaviorSubject<Pickup | null>(pickupParam));
        return new Space(
            passible,
            teamHelper,
            pickupHelper);
    }
    public replaceTeam(team?: Team): void {
        this._team$.next(team ?? null);
    }
    public addTeam(team: Team) {
        this._team$.next(team);
    }
    public removeTeam() {
        if (!this.team$.nullable.value) {
            console.warn("no team to remove");
            return;
        }
        this._team$.next(null);
    }
    public putdown(pickup: Pickup): void {
        if (!this.canPickup) {
            console.warn(`cannot pickup`, pickup);
            return;
        }
        this._pickup$.next(pickup);
    }
    public pickup(): void {
        if (!this.canPutdown) {
            console.warn(`cannot put down`);
            return;
        }
        this._pickup$.next(null);
    }
}
