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
  get teamToken(): string | undefined {
    return this.team?.token;
  }
  get location(): Location | undefined {
    return this.team?.location;
  }
  get canAddAction(): boolean {
    return !!this.roundContext &&
      this.roundContext.actions.assignable.hasBeenSet &&
      this.roundContext.actions.assignable.value.canAddAction();
  }
  get roundEnded(): boolean {
    return !this.game ||
      !this.game.round.assignable.hasBeenSet ||
      !this.game.round.assignable.value.hasEnded.assignable.hasBeenSet ||
      this.game.round.assignable.value.hasEnded.assignable.value;
  }
  get canMoveUp(): boolean {
    return !!this.location &&
      this.canAddAction;
  }
  get canMoveDown(): boolean {
    return !!this.location &&
      this.canAddAction;
  }
  get canMoveLeft(): boolean {
    return !!this.location &&
      this.canAddAction;
  }
  get canMoveRight(): boolean {
    return !!this.location &&
      this.canAddAction;
  }
}

type Location = {
  row: number;
  column: number;
}
