import { Injectable } from '@angular/core';
import { DomainModule } from '../domain.module';
import { Game } from './game';

@Injectable({
  providedIn: DomainModule
})
export class GameRepositoryService {
  private _game?: Game;
  create(id: string): Game {
    return new Game(id);
  }
  put(game: Game): Promise<void> {
    this._game = game;
    return Promise.resolve();
  }
  get(): Game | undefined {
    return this._game;
  }
}
