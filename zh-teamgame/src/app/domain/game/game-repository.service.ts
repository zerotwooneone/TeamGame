import { Injectable } from '@angular/core';
import { Game } from './game';

@Injectable({
  providedIn: 'root'
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
