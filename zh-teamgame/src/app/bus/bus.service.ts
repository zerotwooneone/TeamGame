import { Injectable } from '@angular/core';
import { finalize, Observable, share, Subject, Subscription } from 'rxjs';
import { BareSubjectToken } from './BareSubjectToken';
import { SubjectToken } from './SubjectToken';

@Injectable({
  providedIn: 'root'
})
export class BusService {
  private readonly _topics: { [topicName: string]: Topic } = {};

  constructor() { }
  public publish(token: BareSubjectToken): void {
    const topic = this._topics[token.name];
    if (!topic) {
      console.warn(`no one is subscribed to ${token.name} type:${token.type}`);
      return;
    }
    topic.next({ type: token.type, param: undefined });
  }

  public publishParam<T>(token: SubjectToken<T>, param: T): void {
    const topic = this._topics[token.name];
    if (!topic) {
      console.warn(`no one is subscribed (Param) to ${token.name} type:${token.type}`);
      return;
    }
    topic.next({ type: token.type, param: param });
  }
  public subscribe(token: BareSubjectToken, callback: () => void): Subscription {
    const topic = this._topics[token.name] ?? this.AddNewTopic(token);
    return topic.observable.subscribe(callback);
  }

  public subscribeParam<T>(token: SubjectToken<T>, callback: (param: T) => void): Subscription {
    const topic = this._topics[token.name] ?? this.AddNewTopic(token);
    return topic.observable.subscribe(m => {
      if (m.type !== token.type) {
        console.warn(`types do not match message:${m.type} subscribe:${token.type} subscribe-token:${token.name}`);
        return;
      }
      callback(m.param);
    });
  }

  private AddNewTopic(token: BareSubjectToken): Topic {
    const newSubject = new Subject<BusMessage>();
    const observable = newSubject
      .asObservable()
      .pipe(
        share({ resetOnError: true }),
        finalize(() => {
          this.publishParam(BusService.TopicEnding, token.name);
          delete this._topics[token.name];
        })
      );
    const newTopic = { next: (v: BusMessage) => newSubject.next(v), type: token.type, observable: observable };
    this._topics[token.name] = newTopic;
    return newTopic;
  }
  public static readonly TopicEnding: SubjectToken<string> = new SubjectToken("TopicEnd", "string");
}

type Topic = { readonly type: string, readonly next: (message: BusMessage) => void, readonly observable: Observable<BusMessage> };
type BusMessage = { type: string, param: any | undefined };


