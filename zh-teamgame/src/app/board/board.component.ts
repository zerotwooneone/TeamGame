import { Component, Input } from '@angular/core';
import { isObservable, Observable, Subscription } from 'rxjs';
import { SpaceConfig } from '../space/SpaceConfig';
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
  private _columnDefinitions = "";
  get columnDefinitions(): string {
    return this._columnDefinitions;
  }
  private _rowDefinitions = "";
  get rowDefinitions(): string {
    return this._rowDefinitions;
  }
  /**Row major order list of all spaces */
  spaces: readonly SpaceConfig[] = [];
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

    this.spaces = Array
      .from({ length: this._boardConfig.rowCount }, (v, i) => i)
      .map(rowIndex =>
        Array
          .from({ length: this._boardConfig.columnCount }, (v, i) => i)
          .map(columnIndex => { return this._boardConfig.getSpaceConfig(rowIndex, columnIndex); }))
      .flatMap(a => a);
  }  
  private static readonly DefaultBoardConfig: SanitizedBoardConfig = {
    columnCount: 5,
    columnSize: 100,
    rowCount: 5,
    rowSize: 100,
    getSpaceConfig: BoardComponent.DefaultSpaceConfigFactory
  }
  private static DefaultSpaceConfigFactory(rowIndex: number, columnIndex: number): SpaceConfig {
    return {
      contents: [],
      neighbors: {
        N: {},
        NE: {},
        NW: {},

        E: {},
        W: {},

        S: {},
        SE: {},
        SW: {},
      },
      columnIndex: columnIndex,
      rowIndex: rowIndex
    };
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
  /**Callback to get a particular space's config */
  getSpaceConfig(rowIndex: number, columnIndex: number): SpaceConfig;
}


