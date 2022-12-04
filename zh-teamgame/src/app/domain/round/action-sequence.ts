import { BehaviorSubject } from "rxjs";
import { ObservableProperty, ObservablePropertyHelper } from "../model/ObservablePropertyHelper";

export class ActionSequence {
    get actions$(): ObservableProperty<ActionState> {
        return this._actions.property;
    }
    get submitted$(): ObservableProperty<boolean> {
        return this._submitted$.property;
    }
    constructor(
        private readonly _actions: ObservablePropertyHelper<ActionState>,
        readonly maxActions: number,
        /**monotonically increasing value that represents how old the state is */
        private lastTimeStamp: number,
        readonly hasEnded: ObservableProperty<boolean>,
        private readonly _submitted$: ObservablePropertyHelper<boolean>
    ) { }
    public static Factory(
        maxActions: number,
        lastTimeStamp: number,
        hasEnded: ObservableProperty<boolean>,
        actions?: readonly Action[],
        submitted: boolean = false): ActionSequence {
        const actionParam: ActionState = {
            actions: actions ?? [],
            timeStamp: lastTimeStamp
        };
        return new ActionSequence(
            new ObservablePropertyHelper<ActionState>(
                actionParam,
                new BehaviorSubject<ActionState>(actionParam)
            ),
            maxActions,
            lastTimeStamp,
            hasEnded,
            new ObservablePropertyHelper<boolean>(
                submitted,
                new BehaviorSubject<boolean>(submitted)
            )
        )
    }
    public canAddAction(): boolean {
        return (this.submitted$.assignable.hasBeenSet &&
            !this.submitted$.assignable.value) &&
            (this.actions$.assignable.hasBeenSet &&
                this.actions$.assignable.value.actions.length < this.maxActions) &&
            (this.hasEnded.assignable.hasBeenSet &&
                !this.hasEnded.assignable.value);
    }
    public addAction(action: Action) {
        if (!this.canAddAction()) {
            throw new Error("cannot add action because max has been reached");
        }
        if (!this.actions$.assignable.hasBeenSet) {
            throw new Error("cannot add action. actions has not been set yet");
        }
        const newActions = this.actions$.assignable.value.actions.map(i => i);
        newActions.push(action);
        this._actions.next({
            actions: newActions,
            timeStamp: this.lastTimeStamp
        });
    }
    /**replaces the current actions with the specified values if they are newer */
    public update(
        state: ActionState): void {
        if (!this.actions$.assignable.hasBeenSet) {
            throw new Error("cannot update. actions has not been set yet");
        }
        if (state.timeStamp < this.lastTimeStamp) {
            //we are getting an old update, ignore it
            return;
        }
        this.lastTimeStamp = state.timeStamp;
        const actionsEqual = this.ActionsEqual(state.actions, this.actions$.assignable.value.actions);
        if (actionsEqual) {
            return;
        }
        //if lastTimeStamp === this.lastTimeStamp *here* then it means that we are catching
        // up and we might want to notify someone
        this._actions.next(state);
    }
    private ActionsEqual(first: readonly Action[], second: readonly Action[]): boolean {
        if (first.length !== second.length) {
            return false;
        }
        if (first.length === 0 && second.length === 0) {
            return true;
        }
        return !!(first.every((firstAction, index) => {
            const secondAction = second[index];
            return this.ActionEqual(firstAction, secondAction);
        }));
    }
    private ActionEqual(first: Action, second: Action) {
        return first.move === second.move &&
            first.pickup === second.pickup;
    }
    /**Marks these actions as submitted. The actions cannot be changed by the user after this */
    public Submit(): void {
        this._submitted$.next(true);
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
export interface ActionState {
    readonly actions: readonly Action[];
    readonly timeStamp: number;
}

