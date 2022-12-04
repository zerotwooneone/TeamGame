import { Component, Input } from '@angular/core';
import { BackendService } from '../backend/backend.service';
import { Game } from '../domain/game/game';
import { Action, ActionDirection } from '../domain/round/action-sequence';
import { RoundContext } from '../domain/round/round-context';
import { Team } from '../domain/team/team';
import { User } from '../domain/user/user';

@Component({
  selector: 'zh-dev-util',
  templateUrl: './dev-util.component.html',
  styleUrls: ['./dev-util.component.scss']
})
export class DevUtilComponent {
  @Input()
  game?: Game;
  @Input()
  user?: User;
  @Input()
  roundContext?: RoundContext | null;
  selectedTeam?: string;

  get teamNames(): readonly string[] {
    return Object.keys(this.game?.teams ?? {});
  }
  constructor(readonly backend: BackendService) { }
  onStartRound(): void {
    this.backend.startNewRound();
  }
  onEndRound(): void {
    this.backend.endRound();
  }
  public moveTeamUp(): void {
    const check = this.teamActionCheck();
    if (check.abortAction) {
      return;
    }
    const newActions = this.appendMove(check.actions, "N");
    this.backend.mockUpdateActions(check.team.id, newActions, check.nextTimeStamp);
  }
  private appendMove(actions: Action[], direction: ActionDirection): Action[] {
    actions.push({
      move: direction
    });
    return actions;
  }

  public moveTeamDown(): void {
    const check = this.teamActionCheck();
    if (check.abortAction) {
      return;
    }
    const newActions = this.appendMove(check.actions, "S");
    this.backend.mockUpdateActions(check.team.id, newActions, check.nextTimeStamp);
  }
  public moveTeamLeft(): void {
    const check = this.teamActionCheck();
    if (check.abortAction) {
      return;
    }
    const newActions = this.appendMove(check.actions, "W");
    this.backend.mockUpdateActions(check.team.id, newActions, check.nextTimeStamp);
  }
  public moveTeamRight(): void {
    const check = this.teamActionCheck();
    if (check.abortAction) {
      return;
    }
    const newActions = this.appendMove(check.actions, "E");
    this.backend.mockUpdateActions(check.team.id, newActions, check.nextTimeStamp);
  }
  public pickup(): void {
    const check = this.teamActionCheck();
    if (check.abortAction) {
      return;
    }
    const newActions = check.actions;
    newActions.push({
      pickup: true
    });
    this.backend.mockUpdateActions(check.team.id, newActions, check.nextTimeStamp);
  }
  private teamActionCheck(): { abortAction: true, team?: undefined, round?: undefined, actions?: undefined, nextTimeStamp?: undefined } |
    { abortAction?: false, team: Team, round: RoundContext, actions: Action[], nextTimeStamp: number } {
    if (
      !this.game ||
      !this.roundContext ||
      !this.roundContext.actions.actions$.assignable.hasBeenSet ||
      !this.user) {
      return { abortAction: true };
    }
    return {
      team: this.game.teams[this.user.teamId],
      round: this.roundContext,
      actions: this.roundContext.actions.actions$.assignable.value.actions.map(i => i),
      nextTimeStamp: this.roundContext.actions.actions$.assignable.value.timeStamp + 10
    };
  }
}
