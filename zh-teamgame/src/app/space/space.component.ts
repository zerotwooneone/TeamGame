import { Component, HostBinding, Input } from '@angular/core';
import { SpaceConfig } from './SpaceConfig';

@Component({
  selector: 'zh-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss']
})
export class SpaceComponent {

  get rowIndex(): number {
    return this.spaceConfig.rowIndex;
  }
  get columnIndex(): number {
    return this.spaceConfig.columnIndex;
  }
  @HostBinding('class.impassible')
  get impassible(): boolean {
    return !this.spaceConfig.passable;
  }
  @Input()
  public spaceConfig: SpaceConfig = SpaceComponent.DefaultSpaceConfig;
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
    columnIndex: 1,
    rowIndex: 1,
  }
}



