import { Component, Input } from '@angular/core';
import { BackendService } from '../backend/backend.service';
import { Game } from '../domain/game/game';
import { Action, ActionDirection } from '../domain/round/action-sequence';
import { RoundContext } from '../domain/round/round-context';
import { Team } from '../domain/team/team';

@Component({
  selector: 'zh-dev-util',
  templateUrl: './dev-util.component.html',
  styleUrls: ['./dev-util.component.scss']
})
export class DevUtilComponent {
  @Input()
  game?: Game;
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
    this.backend.updateActions(check.team.id, newActions);
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
    this.backend.updateActions(check.team.id, newActions);
  }
  public moveTeamLeft(): void {
    const check = this.teamActionCheck();
    if (check.abortAction) {
      return;
    }
    const newActions = this.appendMove(check.actions, "W");
    this.backend.updateActions(check.team.id, newActions);
  }
  public moveTeamRight(): void {
    const check = this.teamActionCheck();
    if (check.abortAction) {
      return;
    }
    const newActions = this.appendMove(check.actions, "E");
    this.backend.updateActions(check.team.id, newActions);
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
    this.backend.updateActions(check.team.id, newActions);
  }
  private teamActionCheck(): { abortAction: true, team?: undefined, round?: undefined, actions?: undefined } | { abortAction?: false, team: Team, round: RoundContext, actions: Action[] } {
    if (!this.selectedTeam ||
      !this.game ||
      !this.roundContext ||
      !this.roundContext.actions.assignable.hasBeenSet ||
      !this.roundContext.actions.assignable.value.actions.assignable.hasBeenSet) {
      return { abortAction: true };
    }
    return {
      team: this.game.teams[this.selectedTeam],
      round: this.roundContext,
      actions: this.roundContext.actions.assignable.value.actions.assignable.value.map(i => i)
    };
  }
}
