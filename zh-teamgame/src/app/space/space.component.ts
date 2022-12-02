import { Component, HostBinding, Input, OnDestroy } from '@angular/core';
import { DisposableCollection } from '../domain/model/Disposable';
import { Space } from '../domain/space/space';
import { Team } from '../domain/team/team';
import { ContentConfig } from '../space-content/space-content.component';

@Component({
  selector: 'zh-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss']
})
export class SpaceComponent implements OnDestroy {
  private _team: Team | null = null;
  get team(): Team | null {
    return this._team;
  }

  @HostBinding('class.impassible')
  get impassible(): boolean {
    return !this._space?.passible ?? false;
  }
  private _space?: Space;
  @Input()
  set space(val: Space) {
    this._space = val;
    this._disposables.empty();
    this._disposables.pushSubscription(
      this._space.team$.observable$.subscribe(tid => {
        this.OnTeamChange(tid);
      })
    );
  }
  private readonly _disposables: DisposableCollection;
  contentConfig: ContentConfig;
  constructor() {
    this._disposables = new DisposableCollection();
    this.contentConfig = {};    
  }
  ngOnDestroy(): void {
    this._disposables.Dispose();
  }
  private OnTeamChange(team: Team | null): void {
    this._team = team;
    const teamParam = !!team ?
      { shape: team.token.shape, color: team.token.color }
      : undefined;
    this.contentConfig = { team: teamParam };
  }
}


