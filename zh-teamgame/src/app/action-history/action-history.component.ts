import { Component, Input } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { ActionDirection } from '../domain/round/action-sequence';
import { RoundContext } from '../domain/round/round-context';

@Component({
  selector: 'zh-action-history',
  templateUrl: './action-history.component.html',
  styleUrls: ['./action-history.component.scss']
})
export class ActionHistoryComponent {
  @Input()
  roundContext?: RoundContext;
  get actions$(): Observable<{ action: (ActionDirection | "pickup"), class?: string }[]> | undefined {
    if (!this.roundContext ||
      !this.roundContext.actions.actions.assignable.hasBeenSet) {
      return undefined;
    }
    return this.roundContext.actions.actions.observable$.pipe(
      map(actions => actions.map(a => {
        return !!a.move
          ? { action: a.move, class: this.getMoveClass(a.move) }
          : { action: "pickup" };
      }))
    );
  }
  getMoveClass(move: ActionDirection): string | undefined {
    console.warn(move);
    switch (move) {
      case 'N': return "up";
      case 'E': return "right";
      case 'S': return "down";
      case 'W': return "left";
      default: return undefined;
    }
  }
}
