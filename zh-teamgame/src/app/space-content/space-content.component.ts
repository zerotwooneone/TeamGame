import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ColorFilter } from '../domain/model/color';
import { TeamShapeSource } from '../domain/team/TeamShape';

@Component({
  selector: 'zh-space-content',
  templateUrl: './space-content.component.html',
  styleUrls: ['./space-content.component.scss']
})
export class SpaceContentComponent {

  public teamTokenSource: string | null = null;
  public teamTokenFilter?: SafeStyle;

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
  constructor(readonly sanitizer: DomSanitizer) { }
  private OnConfigChange(config: ContentConfig): void {
    if (config.team) {
      this.teamTokenSource = config.team.shape;
      this.teamTokenFilter = config.team.color; //this.sanitizer.bypassSecurityTrustStyle(
    } else {
      this.teamTokenFilter = undefined;
    }
  }
}

export interface ContentConfig {
  team?: { readonly shape: TeamShapeSource, readonly color: ColorFilter } | null;
}
