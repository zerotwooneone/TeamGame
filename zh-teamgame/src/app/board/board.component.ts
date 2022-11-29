import { Component, Input } from '@angular/core';
import { Game } from '../domain/game/game';
import { Space } from '../domain/space/space';

@Component({
  selector: 'zh-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  private _game?: Game;
  get isConfigured(): boolean {
    return !!this._game;
  }
  @Input()
  set game(val: Game) {
    this._game = val;
    this.spaces = val.board.rows.flat();
  }
  get columnDefinitions(): string {
    return this._game?.board.columnDefinition ?? "";
  }
  get rowDefinitions(): string {
    return this._game?.board.rowDefinition ?? "";
  }
  /**Row major order list of all spaces */
  spaces: Space[] = [];
}


