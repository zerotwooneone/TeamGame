import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { BusService } from '../bus/bus.service';
import { Topics } from '../bus/topics';
import { DomainModule } from '../domain.module';
import { GameService } from '../game/game.service';
import { Disposable, DisposableCollection } from '../model/Disposable';
import { RoundContext } from './round-context';

@Injectable({
  providedIn: DomainModule
})
export class RoundContextService {
  private readonly _roundContext$: Subject<RoundContext>;
  get roundContext$(): Observable<RoundContext> {
    return this._roundContext$.asObservable();
  }
  constructor(
    private readonly bus: BusService,
    private readonly gameService: GameService) {
    this._roundContext$ = new Subject<RoundContext>();
  }
  public BeginListening(): Disposable {
    const disposable = new DisposableCollection();
    disposable.pushSubscription(
      this.bus.subscribeParam(Topics.NewRound, g => this.OnNewRound(g))
    )

    return disposable;
  }
  public OnNewRound(gameId: string): void {
    const game = this.gameService.getById(gameId);
    if (!game) {
      console.error("cannot start new round context. game was not found");
      return;
    }
    if (!game.round.assignable.hasBeenSet) {
      console.error("cannot start new round context. round was not set");
      return;
    }
    const context = RoundContext.Factory(
      game.round.assignable.value,
      0
    );
    this._roundContext$.next(context);
  }
}
