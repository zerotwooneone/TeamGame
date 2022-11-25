import { Component, Input } from '@angular/core';
import { BoardConfig } from './BoardConfig';

@Component({
  selector: 'zh-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  @Input()
  public boardConfig: BoardConfig = BoardComponent.DefaultBoardConfig;
  private static DefaultBoardConfig: BoardConfig = {
    columnCount: 5,
    columnSize: 100,
    rowCount: 5,
    rowSize: 100
  }
  private _columnWidth = 100;
  private _columnCount = 5;
  private _columnDefinitions: string = this.getGridDefinition(this._columnWidth, this._columnCount);
  get columnDefinitions(): string {
    return this._columnDefinitions;
  }
  private _rowWidth = 100;
  private _rowCount = 5;
  private _rowDefinitions: string = this.getGridDefinition(this._rowWidth, this._rowCount);
  get rowDefinitions(): string {
    return this._rowDefinitions;
  }
  private getGridDefinition(size: number, count: number): string {
    const pixelSize = `${size}px`;
    return Array
      .from({ length: count })
      .map(_ => pixelSize)
      .reduce((prev, curr) => `${prev} ${curr}`);
  }
}


