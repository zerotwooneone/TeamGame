import { Action, ActionSequence } from "./action-sequence";
import { Round } from "./round";

export class RoundContext {
    constructor(
        readonly round: Round,
        readonly actions: ActionSequence) { }
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
            actionsParam
        );
    }
}