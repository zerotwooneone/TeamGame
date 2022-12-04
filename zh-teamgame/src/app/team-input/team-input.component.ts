import { Component, Input } from '@angular/core';
import { filter, interval, map, Observable, take, takeUntil } from 'rxjs';
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

  private _secondsLeft?: Observable<number>;
  get secondsLeft(): Observable<number> | undefined {
    return this._secondsLeft;
  }
  private _timeLeft?: Observable<string>;
  get timeLeft(): Observable<string> | undefined {
    return this._timeLeft;
  }
  private _roundContext?: RoundContext;
  get roundContext(): RoundContext | undefined {
    return this._roundContext;
  }
  @Input()
  set roundContext(val: RoundContext | undefined) {
    this._roundContext = val;
    if (!this._roundContext) {
      this._timeLeft = undefined;
      return;
    }
    this._secondsLeft = interval(300).pipe(
      map(_ => {
        if (!this._roundContext) {
          return 0;
        }
        const nowDate = new Date();
        const nowTimestamp = nowDate.getTime();
        const endDate = this._roundContext.round.end;
        const endTimestamp = endDate.getTime();
        return (endTimestamp - nowTimestamp) / 1000;
      }),
      takeUntil(this._roundContext.round.hasEnded.observable$.pipe(filter(h => h), take(1)))
    );
    this._timeLeft = this._secondsLeft.pipe(
      map(totalSeconds => {
        const minutes = Math.trunc(totalSeconds / 60);
        const seconds = Math.round(totalSeconds % 60);
        return `${minutes}:${String(seconds).padStart(2, "0")}`;
      })
    )
  }

  get team(): Team | null {
    if (!this.user || !this.game) {
      return null;
    }
    return this.game.teams[this.user.teamId];
  }
  get teamShape(): string | undefined {
    return this.team?.token.shape;
  }
  get teamTokenFilter(): string | undefined {
    return this.team?.token.color;
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
