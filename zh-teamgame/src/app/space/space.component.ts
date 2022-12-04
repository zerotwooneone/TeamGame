import { Component, HostBinding, Input, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { NullableObservableProperty } from '../domain/model/ObservablePropertyHelper';
import { Pickup } from '../domain/pickup/pickup';
import { Space } from '../domain/space/space';
import { Team } from '../domain/team/team';

@Component({
  selector: 'zh-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss']
})
export class SpaceComponent {
  private _team$?: NullableObservableProperty<Team>;
  get team$(): Observable<Team | null> | undefined {
    return this._team$?.observable$;
  }
  private _pickup$?: NullableObservableProperty<Pickup>;
  get pickup$(): Observable<Pickup | null> | undefined {
    return this._pickup$?.observable$;
  }

  @HostBinding('class.impassible')
  get impassible(): boolean {
    return !this._space?.passible ?? false;
  }
  private _space?: Space;
  @Input()
  set space(val: Space) {
    this._space = val;
    this._team$ = this._space.team$;
    this._pickup$ = this._space.pickup$;
  }
}


