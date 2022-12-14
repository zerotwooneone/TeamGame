import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { BareSubjectToken } from '../bus/BareSubjectToken';
import { BusService } from '../bus/bus.service';
import { SubjectToken } from '../bus/SubjectToken';

@Injectable({
  providedIn: 'root'
})
export class AppBusService {

  constructor(private readonly bus: BusService) { }

  public publish(token: BareSubjectToken): void {
    this.bus.publish(token);
  }

  public publishParam<T>(token: SubjectToken<T>, param: T): void {
    this.bus.publishParam(token, param);
  }
  public subscribe(token: BareSubjectToken, callback: () => void): Subscription {
    return this.bus.subscribe(token, callback);
  }

  public subscribeParam<T>(token: SubjectToken<T>, callback: (param: T) => void): Subscription {
    return this.bus.subscribeParam(token, callback);
  }
}
