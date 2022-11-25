import { Component, Input } from '@angular/core';
import { isObservable, Observable, Subscription } from 'rxjs';
import { BoardConfig } from './BoardConfig';

@Component({
  selector: 'zh-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  private _boardConfig = BoardComponent.DefaultBoardConfig;
  private _configSubscription: Subscription | undefined;
  @Input()
  set boardConfig(val: BoardConfig | Observable<BoardConfig>) {
    if (this._configSubscription) {
      this._configSubscription.unsubscribe();
    }

    if (isObservable(val)) {
      this._configSubscription = val.subscribe(c => {
        this._boardConfig = this.sanitizeConfig(c);
        this.setConfig(this._boardConfig);
      });
      return;
    }
    this._boardConfig = this.sanitizeConfig(val);
    this.setConfig(this._boardConfig);
  }
  public constructor() {
    this.setConfig(this._boardConfig);
  }
  private sanitizeConfig(config: BoardConfig): SanitizedBoardConfig {
    const sanitized = Object.assign({}, BoardComponent.DefaultBoardConfig, config);
    if (!sanitized.columnCount || sanitized.columnCount < 1) {
      sanitized.columnCount = BoardComponent.DefaultBoardConfig.columnCount;
    }

    if (!sanitized.rowCount || sanitized.rowCount < 1) {
      sanitized.rowCount = BoardComponent.DefaultBoardConfig.rowCount;
    }

    if (!sanitized.columnSize || sanitized.columnSize < 1) {
      sanitized.columnSize = BoardComponent.DefaultBoardConfig.columnSize;
    }

    if (!sanitized.rowSize || sanitized.rowSize < 1) {
      sanitized.rowSize = BoardComponent.DefaultBoardConfig.rowSize;
    }
    return sanitized;
  }
  private setConfig(config: SanitizedBoardConfig): void {
    this._columnDefinitions = this.getGridDefinition(config.columnSize, config.columnCount);
    this._rowDefinitions = this.getGridDefinition(config.rowSize, config.rowCount);
  }
  private static readonly DefaultBoardConfig: SanitizedBoardConfig = {
    columnCount: 5,
    columnSize: 100,
    rowCount: 5,
    rowSize: 100
  }
  private _columnDefinitions = "";
  get columnDefinitions(): string {
    return this._columnDefinitions;
  }
  private _rowDefinitions = "";
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

interface SanitizedBoardConfig {
  rowCount: number;
  rowSize: number;
  columnCount: number;
  columnSize: number;
}


