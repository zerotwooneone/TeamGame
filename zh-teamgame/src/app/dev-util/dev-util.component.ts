import { Component, Input } from '@angular/core';
import { BackendService } from '../backend/backend.service';
import { Game } from '../domain/game/game';
import { Team } from '../domain/team/team';

@Component({
  selector: 'zh-dev-util',
  templateUrl: './dev-util.component.html',
  styleUrls: ['./dev-util.component.scss']
})
export class DevUtilComponent {
  @Input()
  game?: Game;
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
  public moveSelectedUp(): void {
    const check = this.moveTeamCheck();
    if (check.abortMove) {
      return;
    }
    this.backend.moveTeam(check.team.id, { row: check.team.location.row - 1, column: check.team.location.column });
  }
  public moveSelectedDown(): void {
    const check = this.moveTeamCheck();
    if (check.abortMove) {
      return;
    }
    this.backend.moveTeam(check.team.id, { row: check.team.location.row + 1, column: check.team.location.column });
  }
  public moveSelectedLeft(): void {
    const check = this.moveTeamCheck();
    if (check.abortMove) {
      return;
    }
    this.backend.moveTeam(check.team.id, { row: check.team.location.row, column: check.team.location.column - 1 });
  }
  public moveSelectedRight(): void {
    const check = this.moveTeamCheck();
    if (check.abortMove) {
      return;
    }
    this.backend.moveTeam(check.team.id, { row: check.team.location.row, column: check.team.location.column + 1 });
  }
  private moveTeamCheck(): { abortMove: true, team?: undefined } | { abortMove?: false, team: Team } {
    if (!this.selectedTeam ||
      !this.game) {
      return { abortMove: true };
    }
    return { team: this.game.teams[this.selectedTeam] };
  }
}
