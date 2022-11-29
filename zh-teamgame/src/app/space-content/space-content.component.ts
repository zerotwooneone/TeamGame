import { Component, Input } from '@angular/core';

@Component({
  selector: 'zh-space-content',
  templateUrl: './space-content.component.html',
  styleUrls: ['./space-content.component.scss']
})
export class SpaceContentComponent {

  public teamTokenUrl: string | null = null;

  @Input()
  row?: number = -1;
  @Input()
  column?: number = -1;

  @Input()
  set contentConfig(config: ContentConfig | null) {
    if (!config) {
      return;
    }
    this.OnConfigChange(config);
  }
  private OnConfigChange(config: ContentConfig): void {
    if (typeof config.teamTokenUrl !== "undefined") {
      this.teamTokenUrl = config.teamTokenUrl;
    }
  }
}

export interface ContentConfig {
  teamTokenUrl?: string | null;
}
