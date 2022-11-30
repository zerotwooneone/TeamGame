import { BehaviorSubject, filter, take } from "rxjs";
import { ObservableProperty, ObservablePropertyHelper } from "../model/ObservablePropertyHelper";
import { Action, ActionSequence } from "./action-sequence";
import { Round } from "./round";

export class RoundContext {
    get actions(): ObservableProperty<ActionSequence> {
        return this._actions.property;
    }
    constructor(
        readonly round: Round,
        private readonly _actions: ObservablePropertyHelper<ActionSequence>) { }
    public static Factory(
        round: Round,
        lastTimeStamp: number,
        actions?: readonly Action[]): RoundContext {
        const actionsParam = ActionSequence.Factory(
            round.maxActions,
            lastTimeStamp,
            round.hasEnded,
            actions
        );
        return new RoundContext(
            round,
            new ObservablePropertyHelper<ActionSequence>(
                actionsParam,
                new BehaviorSubject<ActionSequence>(actionsParam)
            )
        );
    }
}