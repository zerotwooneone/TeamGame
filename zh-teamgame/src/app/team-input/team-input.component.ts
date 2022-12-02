import { Component, Input } from '@angular/core';
import { Game } from '../domain/game/game';
import { RoundContext } from '../domain/round/round-context';
import { Team } from '../domain/team/team';
import { User } from '../domain/user/user';

@Component({
  selector: 'zh-team-input',
  templateUrl: './team-input.component.html',
  styleUrls: ['./team-input.component.scss']
})
export class TeamInputComponent {
  @Input()
  user?: User;

  @Input()
  game?: Game;

  @Input()
  roundContext?: RoundContext | null;

  get team(): Team | null {
    if (!this.user || !this.game) {
      return null;
    }
    return this.game.teams[this.user.teamId];
  }
  get teamShape(): string | undefined {
    return this.team?.token.shape;
  }
  get location(): Location | undefined {
    return this.team?.token.location;
  }
  private get canAddAction(): boolean {
    return !!this.roundContext &&
      this.roundContext.actions.canAddAction();
  }
  get roundEnded(): boolean {
    return !this.game ||
      !this.game.round.assignable.hasBeenSet ||
      !this.game.round.assignable.value.hasEnded.assignable.hasBeenSet ||
      this.game.round.assignable.value.hasEnded.assignable.value;
  }
  get actionDisabled(): boolean {
    return !this.location ||
      !this.canAddAction;
  }
  public moveUp(): void {
    if (this.actionDisabled ||
      !this.roundContext) {
      return;
    }
    this.roundContext.actions.addAction({ move: "N" })
  }
  public moveDown(): void {
    if (this.actionDisabled ||
      !this.roundContext) {
      return;
    }
    this.roundContext.actions.addAction({ move: "S" })
  }
  public moveLeft(): void {
    if (this.actionDisabled ||
      !this.roundContext) {
      return;
    }
    this.roundContext.actions.addAction({ move: "W" })
  }
  public moveRight(): void {
    if (this.actionDisabled ||
      !this.roundContext) {
      return;
    }
    this.roundContext.actions.addAction({ move: "E" })
  }
  public pickup(): void {
    if (this.actionDisabled ||
      !this.roundContext) {
      return;
    }
    this.roundContext.actions.addAction({ pickup: true })
  }
}

type Location = {
  row: number;
  column: number;
}
