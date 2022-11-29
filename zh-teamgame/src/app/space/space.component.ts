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
      this._space.teamId$.observable$.subscribe(tid => {
        this.OnTeamIdChange(tid);
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
  private OnTeamIdChange(teamId: string | null): void {
    //todo: this is a hack we are using the url as the team id
    this.contentConfig = { teamTokenUrl: teamId };
  }
}


