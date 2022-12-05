import { Component, Input } from '@angular/core';
import { Pickup } from '../domain/pickup/pickup';
import { DropOff } from '../domain/space/drop-off';
import { Team } from '../domain/team/team';

@Component({
  selector: 'zh-space-content',
  templateUrl: './space-content.component.html',
  styleUrls: ['./space-content.component.scss']
})
export class SpaceContentComponent {

  @Input()
  row?: number = -1;
  @Input()
  column?: number = -1;
  @Input()
  team: Team | null = null;
  @Input()
  pickup: Pickup | null = null;
  @Input()
  dropOff?: DropOff;

  get teamFilter(): string | undefined {
    if (!this.team) {
      return undefined;
    }
    return this.team.token.color;
  }
  get teamShape(): string | undefined {
    if (!this.team) {
      return undefined;
    }
    return this.team.token.shape;
  }
  get teamPickup(): Pickup | undefined {
    if (!this.team) {
      return undefined;
    }
    return this.team.token.heldPickup;
  }
  get teamPickupShape(): string | undefined {
    if (!this.teamPickup) {
      return undefined;
    }
    return this.teamPickup.shape;
  }
  get teamPickupFilter(): string | undefined {
    if (!this.teamPickup) {
      return undefined;
    }
    return this.teamPickup.color;
  }

  get pickupFilter(): string | undefined {
    if (!this.pickup) {
      return undefined;
    }
    return this.pickup.color;
  }
  get pickupShape(): string | undefined {
    if (!this.pickup) {
      return undefined;
    }
    return this.pickup.shape;
  }
  get dropOffLetter(): string | undefined {
    return this.dropOff?.letter;
  }

}
