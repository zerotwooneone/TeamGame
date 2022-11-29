import { BehaviorSubject } from "rxjs";
import { NullableObservableProperty, NullableObservablePropertyHelper } from "../model/ObservablePropertyHelper";

export class Space {
    get passible(): boolean {
        return this._passible;
    }
    get team$(): NullableObservableProperty<SpaceTeam> {
        return this._team$.property;
    }
    constructor(
        private _passible: boolean,
        private readonly _team$: NullableObservablePropertyHelper<SpaceTeam>) { }
    public static Factory(
        passible: boolean,
        team: SpaceTeam | null): Space {
        const teamParam = team ?? null;
        const teamIdHelper = new NullableObservablePropertyHelper<SpaceTeam>(
            teamParam,
            new BehaviorSubject<SpaceTeam | null>(teamParam))
        return new Space(
            passible,
            teamIdHelper);
    }
    public replaceTeam(team?: SpaceTeam): void {
        this._team$.next(team ?? null);
    }
    public addTeam(team: SpaceTeam) {
        this._team$.next(team);
    }
    public removeTeam() {
        if (!this.team$.nullable.value) {
            console.warn("no team to remove");
            return;
        }
        this._team$.next(null);
    }
}

export type SpaceTeam = {
    id: string,
    token: string
};
