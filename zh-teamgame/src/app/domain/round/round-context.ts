import { Team } from "../team/team";
import { Action, ActionSequence } from "./action-sequence";
import { Round } from "./round";

export class RoundContext {
    constructor(
        readonly round: Round,
        readonly actions: ActionSequence,
        readonly team: Team) { }
    public static Factory(
        round: Round,
        lastTimeStamp: number,
        team: Team,
        actions?: readonly Action[]): RoundContext {
        const actionsParam = ActionSequence.Factory(
            round.maxActions,
            lastTimeStamp,
            round.hasEnded,
            actions
        );
        const context = new RoundContext(
            round,
            actionsParam,
            team
        );
        return context;
    }
}