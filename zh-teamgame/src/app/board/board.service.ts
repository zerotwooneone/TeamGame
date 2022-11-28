import { Injectable } from '@angular/core';
import { AppBusService } from '../appbus/appbus.service';
import { SubjectToken } from '../bus/SubjectToken';
import { SpaceComponent } from '../space/space.component';
import { SpaceNotification } from '../space/SpaceNotification';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(
    readonly bus: AppBusService) { }

  public notifySpace(rowIndex: number, columnIndex: number, notification: SpaceNotification): void {
    const subjectToken = new SubjectToken<SpaceNotification>(SpaceComponent.GetNotificationTopicName(rowIndex, columnIndex), "SpaceNotification");
    this.bus.publishParam(subjectToken, notification);
  }
}
