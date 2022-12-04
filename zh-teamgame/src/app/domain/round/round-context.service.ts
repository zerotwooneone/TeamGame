import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DomainModule } from '../domain.module';
import { Disposable, DisposableCollection } from '../model/Disposable';
import { RoundContext } from './round-context';
import { RoundContextRepositoryService } from './round-context-repository.service';

@Injectable({
  providedIn: DomainModule
})
export class RoundContextService {
  private readonly _roundContext$: Subject<RoundContext>;
  get roundContext$(): Observable<RoundContext> {
    return this._roundContext$.asObservable();
  }
  constructor(
    private readonly contextRepository: RoundContextRepositoryService) {
    this._roundContext$ = new Subject<RoundContext>();
  }
  public BeginListening(
    gameId: string,
    teamId: string,
    round$: Observable<any>): Disposable {
    const disposable = new DisposableCollection();
    disposable.pushSubscription(
      round$.subscribe(_ => this.OnNewRound(gameId, teamId))
    )

    return disposable;
  }
  private OnNewRound(
    gameId: string,
    teamId: string) {
    /*const oldContext = this.contextRepository.get();
    if (oldContext) {
      this.disposeContext(oldContext);
    }*/
    const context = this.contextRepository.create(gameId, teamId);
    this.contextRepository.put(context);

    this._roundContext$.next(context);
  }
}
