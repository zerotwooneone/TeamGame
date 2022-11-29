import { BehaviorSubject } from "rxjs";
import { NullableObservableProperty, NullableObservablePropertyHelper } from "../model/ObservablePropertyHelper";

export class Space {
    get passible(): boolean {
        return this._passible;
    }
    get teamId$(): NullableObservableProperty<string> {
        return this._teamId$.property;
    }
    constructor(
        private _passible: boolean,
        private readonly _teamId$: NullableObservablePropertyHelper<string>) { }
    public static Factory(
        passible: boolean,
        teamId?: string): Space {
        const idParam = teamId ?? null;
        const teamIdHelper = new NullableObservablePropertyHelper<string>(
            idParam,
            new BehaviorSubject<string | null>(idParam))
        return new Space(
            passible,
            teamIdHelper);
    }
    public replaceTeam(teamId?: string): void {
        this._teamId$.next(teamId ?? null);
    }
    public addTeam(teamId: string) {
        this._teamId$.next(teamId);
    }
    public removeTeam() {
        if (!this.teamId$.nullable.value) {
            console.warn("no team to remove");
            return;
        }
        this._teamId$.next(null);
    }
}
