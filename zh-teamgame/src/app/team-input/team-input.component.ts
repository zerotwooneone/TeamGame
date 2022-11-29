import { Component, Input } from '@angular/core';
import { UserDetails } from '../backend/backend.service';
import { Game } from '../domain/game/game';

@Component({
  selector: 'zh-team-input',
  templateUrl: './team-input.component.html',
  styleUrls: ['./team-input.component.scss']
})
export class TeamInputComponent {
  @Input()
  user?: UserDetails;

  @Input()
  game?: Game;

  get teamToken(): string | null {
    if (!this.user || !this.game) {
      return null;
    }
    return this.game.teams[this.user.teamId].token;
  }
}
