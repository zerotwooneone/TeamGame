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
  private _boardConfig?: SanitizedBoardConfig;
  get isConfigured(): boolean {
    return !!this._boardConfig;
  }
  private _configSubscription: Subscription | undefined;
  @Input()
  set boardConfig(val: BoardConfig | Observable<BoardConfig> | undefined) {
    if (this._configSubscription) {
      this._configSubscription.unsubscribe();
    }

    if (typeof val === "undefined") {
      return;
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
  private sanitizeConfig(config: BoardConfig): SanitizedBoardConfig {
    const sanitized = Object.assign({}, config) as SanitizedBoardConfig;
    if (!sanitized.columnCount || sanitized.columnCount < 1) {
      throw new Error("invalid column count");
    }

    if (!sanitized.rowCount || sanitized.rowCount < 1) {
      throw new Error("invalid row count");
    }

    if (!sanitized.columnSize || sanitized.columnSize < 1) {
      throw new Error("invalid column size");
    }

    if (!sanitized.rowSize || sanitized.rowSize < 1) {
      throw new Error("invalid row size");
    }
    return sanitized;
  }
  private setConfig(config: SanitizedBoardConfig): void {
    this._columnDefinitions = this.getGridDefinition(config.columnSize, config.columnCount);
    this._rowDefinitions = this.getGridDefinition(config.rowSize, config.rowCount);

    this.spaces = Array
      .from({ length: config.rowCount }, (v, i) => i)
      .map(rowIndex =>
        Array
          .from({ length: config.columnCount }, (v, i) => i)
          .map(columnIndex => { return config.getSpaceConfig(rowIndex, columnIndex); }))
      .flatMap(a => a);
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


