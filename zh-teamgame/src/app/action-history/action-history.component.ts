import { Component, Input } from '@angular/core';
import { debounceTime, map, Observable, Subject } from 'rxjs';
import { ActionDirection } from '../domain/round/action-sequence';
import { RoundContext } from '../domain/round/round-context';

@Component({
  selector: 'zh-action-history',
  templateUrl: './action-history.component.html',
  styleUrls: ['./action-history.component.scss']
})
export class ActionHistoryComponent {
  @Input()
  set roundContext(value: RoundContext | undefined) {
    if (!value ||
      !value.actions.actions$.assignable.hasBeenSet) {
      return;
    }
    const actionDebounceMs = 30;
    this._actions$ = value.actions.actions$.observable$.pipe(
      debounceTime(actionDebounceMs),
      map(actions => actions.actions.map(a => {
        return !!a.move
          ? { action: a.move, class: this.getMoveClass(a.move) }
          : { action: "pickup" };
      }))
    );
  }
  private _actions$?: Observable<{ action: (ActionDirection | "pickup"), class?: string }[]>;
  get actions$(): Observable<{ action: (ActionDirection | "pickup"), class?: string }[]> | undefined {
    return this._actions$;
  }
  getMoveClass(move: ActionDirection): string | undefined {
    switch (move) {
      case 'N': return "up";
      case 'E': return "right";
      case 'S': return "down";
      case 'W': return "left";
      default: return undefined;
    }
  }
}
