import { Component, HostBinding, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppBusService } from '../appbus/appbus.service';
import { SubjectToken } from '../bus/SubjectToken';
import { SpaceConfig } from './SpaceConfig';
import { SpaceNotification } from './SpaceNotification';

@Component({
  selector: 'zh-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss']
})
export class SpaceComponent implements OnDestroy {

  get rowIndex(): number {
    return this._spaceConfig.rowIndex;
  }
  get columnIndex(): number {
    return this._spaceConfig.columnIndex;
  }
  @HostBinding('class.impassible')
  get impassible(): boolean {
    return !this._spaceConfig.passable;
  }
  private _spaceConfig: SpaceConfig = SpaceComponent.DefaultSpaceConfig;
  @Input()
  set spaceConfig(val: SpaceConfig) {
    this._spaceConfig = val;
    if (typeof this._spaceConfig.columnIndex !== "number" ||
      typeof this._spaceConfig.rowIndex !== "number") {
      console.warn("non-numeric row or column index. skipping subscribe");
      return;
    }
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    const notificationToken = new SubjectToken<SpaceNotification>(SpaceComponent.GetNotificationTopicName(this._spaceConfig.rowIndex, this._spaceConfig.columnIndex), "SpaceNotification");
    this.notificationSubscription = this.bus.subscribeParam(notificationToken, this.OnNotification.bind(this));
  }
  private notificationSubscription?: Subscription;
  private static readonly DefaultSpaceConfig: SpaceConfig = {
    neighbors: {
      N: {},
      NE: {},
      NW: {},

      E: {},
      W: {},

      S: {},
      SE: {},
      SW: {},
    },
    contents: [],
    columnIndex: 9999,
    rowIndex: 9999,
  }
  constructor(readonly bus: AppBusService) {
    this.spaceConfig = SpaceComponent.DefaultSpaceConfig;
  }
  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }
  private OnNotification(notification: SpaceNotification): void {
    console.log(`r:${this._spaceConfig.rowIndex} c:${this._spaceConfig.columnIndex} notification:${JSON.stringify(notification)}`);
  }
  /**This is a hack to allow direct calls to each space. We shouldn't use the bus for direct UI access like this */
  public static GetNotificationTopicName(rowIndex: number, columnIndex: number): string {
    return `r:${rowIndex} c:${columnIndex}`
  }
}


