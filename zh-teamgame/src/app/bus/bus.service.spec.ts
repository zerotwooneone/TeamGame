import { TestBed } from '@angular/core/testing';

import { BusService } from './bus.service';
import { BareSubjectToken } from "./BareSubjectToken";
import { SubjectToken } from "./SubjectToken";

describe('BusService', () => {
  let service: BusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should publish', () => {
    const bareToken = new BareSubjectToken("something");
    let bareWorks = false;
    const bareSubscription = service.subscribe(bareToken, () => { bareWorks = true; });

    let paramWorks: number | undefined;
    const paramToken = new SubjectToken<number>("param topic", "number");
    service.subscribeParam(paramToken, n => { paramWorks = n; });

    service.publish(bareToken);
    expect(bareToken).toBeTruthy();
    expect(paramWorks).toBeFalsy();

    service.publishParam(paramToken, 6);
    expect(paramWorks).toBe(6);

    let topicEnding: string | undefined;
    service.subscribeParam(BusService.TopicEnding, s => { topicEnding = s; })
    expect(topicEnding).toBeFalsy();
    bareSubscription.unsubscribe();
    expect(topicEnding).toBe(bareToken.name);
  });
});
