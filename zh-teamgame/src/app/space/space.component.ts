import { Component, HostBinding, Input, OnDestroy } from '@angular/core';
import { DisposableCollection } from '../domain/model/Disposable';
import { Space } from '../domain/space/space';
import { ContentConfig } from '../space-content/space-content.component';

@Component({
  selector: 'zh-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss']
})
export class SpaceComponent implements OnDestroy {
  private _teamId: string | null = null;
  get teamId(): string | null {
    return this._teamId;
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
        const { id, token } = tid && tid.id && tid.token
          ? { id: tid.id, token: tid.token }
          : { id: null, token: null };
        this.OnTeamChange(id, token);
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
  private OnTeamChange(
    teamId: string | null,
    teamToken: string | null): void {
    this._teamId = teamId;
    this.contentConfig = { teamTokenUrl: teamToken };
  }
}


