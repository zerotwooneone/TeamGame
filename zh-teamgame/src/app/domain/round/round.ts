import { BehaviorSubject } from "rxjs";
import { ObservableProperty, ObservablePropertyHelper } from "../model/ObservablePropertyHelper";

export class Round {
    get hasEnded(): ObservableProperty<boolean> {
        return this._hasEnded.property;
    }
    constructor(
        readonly id: number,
        readonly end: Date,
        readonly maxActions: number,
        private _hasEnded: ObservablePropertyHelper<boolean>) { }
    public static Factory(
        id: number,
        end: Date,
        maxActions: number): Round {
        return new Round(
            id,
            end,
            maxActions,
            new ObservablePropertyHelper<boolean>(
                false,
                new BehaviorSubject<boolean>(false)
            )
        );
    }
    endRound() {
        this._hasEnded.next(true);
    }
}
