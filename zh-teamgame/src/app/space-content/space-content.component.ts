import { Component, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'zh-space-content',
  templateUrl: './space-content.component.html',
  styleUrls: ['./space-content.component.scss']
})
export class SpaceContentComponent {

  public teamTokenUrl: string | null = null;
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
