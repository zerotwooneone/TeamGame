import { BehaviorSubject } from "rxjs";
import { ObservableProperty, ObservablePropertyHelper } from "../model/ObservablePropertyHelper";

export class ActionSequence {
    get actions(): ObservableProperty<readonly Action[]> {
        return this._actions.property;
    }
    constructor(
        private readonly _actions: ObservablePropertyHelper<readonly Action[]>,
        readonly maxActions: number,
        /**monotonically increasing value that represents how old the state is */
        private lastTimeStamp: number,
        readonly hasEnded: ObservableProperty<boolean>,
        private _submitted?: boolean
    ) { }
    public static Factory(
        maxActions: number,
        lastTimeStamp: number,
        hasEnded: ObservableProperty<boolean>,
        actions?: readonly Action[]): ActionSequence {
        const actionParam = actions ?? [];
        return new ActionSequence(
            new ObservablePropertyHelper<readonly Action[]>(
                actionParam,
                new BehaviorSubject<readonly Action[]>(actionParam)
            ),
            maxActions,
            lastTimeStamp,
            hasEnded
        )
    }
    public canAddAction(): boolean {
        return !this._submitted &&
            (this.actions.assignable.hasBeenSet &&
                this.actions.assignable.value.length < this.maxActions) &&
            (this.hasEnded.assignable.hasBeenSet &&
                !this.hasEnded.assignable.value);
    }
    public addAction(action: Action) {
        if (!this.canAddAction()) {
            throw new Error("cannot add action because max has been reached");
        }
        if (!this.actions.assignable.hasBeenSet) {
            throw new Error("cannot add action. actions has not been set yet");
        }
        const newActions = this.actions.assignable.value.map(i => i);
        newActions.push(action);
        this._actions.next(newActions);
    }
    /**replaces the current actions with the specified values if they are newer */
    public update(
        actions: readonly Action[],
        lastTimeStamp: number): void {
        if (!this.actions.assignable.hasBeenSet) {
            throw new Error("cannot update. actions has not been set yet");
        }
        if (lastTimeStamp < this.lastTimeStamp) {
            //we are getting an old update, ignore it
            return;
        }
        this.lastTimeStamp = lastTimeStamp;
        const actionsEqual = this.ActionsEqual(actions, this.actions.assignable.value);
        if (actionsEqual) {
            return;
        }
        //if lastTimeStamp === this.lastTimeStamp *here* then it means that we are catching
        // up and we might want to notify someone
        this._actions.next(actions);
    }
    private ActionsEqual(first: readonly Action[], second: readonly Action[]): boolean {
        if (first.length !== second.length) {
            return false;
        }
        if (first.length === 0 && second.length === 0) {
            return true;
        }
        for (const firstAction of first) {
            for (const secondAction of second) {
                if (!this.ActionEqual(firstAction, secondAction)) {
                    return false;
                }
            }
        }
        return true;
    }
    private ActionEqual(first: Action, second: Action) {
        return first.move === second.move &&
            first.pickup === second.pickup;
    }
    /**Marks these actions as submitted. The actions cannot be changed by the user after this */
    public Submit(): void {
        this._submitted = true;
    }
}

export type ActionDirection = "N" | "NE" | "NW" | "E" | "W" | "S" | "SE" | "SW";
export type Action = {
    pickup?: undefined;
    move: ActionDirection
} | {
    pickup: true
    move?: undefined;
};

