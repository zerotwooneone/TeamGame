import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { BareSubjectToken } from 'src/app/bus/BareSubjectToken';
import { SubjectToken } from 'src/app/bus/SubjectToken';
import { DomainModule } from '../domain.module';
import { BusService as CommonBus } from '../../bus/bus.service';

@Injectable({
  providedIn: DomainModule
})
export class BusService {

  constructor(readonly bus: CommonBus) { }

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
