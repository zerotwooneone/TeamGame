import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NeighborInfo } from '../space/NeighborInfo';
import { SpaceConfig } from '../space/SpaceConfig';
import { BoardConfig } from './BoardConfig';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(readonly httpClient: HttpClient) { }

  public async getBoardConfig(token: string): Promise<BoardConfig> {
    const data = await firstValueFrom(this.httpClient.get("assets/boards/board1.json")) as BoardJson;
    const rowCount = data.rows.length;
    const columnCount = data.rows.reduce((prevMax, column) => {
      if (column.length > prevMax) {
        return column.length;
      }
      return prevMax;
    }, 0);
    return {
      rowCount: rowCount,
      columnCount: columnCount,
      rowSize: data.spaceSize,
      columnSize: data.spaceSize,
      getSpaceConfig: this.lookupFunctionFactory(data)
    }
  }
  private lookupFunctionFactory(board: BoardJson): (rowIndex: number, columnIndex: number) => SpaceConfig {
    return (rowIndex: number, columnIndex: number) => {
      const space = board.rows[rowIndex][columnIndex];

      return {
        columnIndex: columnIndex,
        rowIndex: rowIndex,
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
        passable: !space.impassible
      }
    }
  }
}

interface BoardJson {
  rows: ColumnArray[];
  spaceSize: number;
}

type ColumnArray = SpaceJson[];
interface SpaceJson {
  impassible?: boolean;
}
