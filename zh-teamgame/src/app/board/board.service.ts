import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, timer } from 'rxjs';
import { AppBusService } from '../appbus/appbus.service';
import { SubjectToken } from '../bus/SubjectToken';
import { SpaceComponent } from '../space/space.component';
import { SpaceConfig } from '../space/SpaceConfig';
import { SpaceNotification } from '../space/SpaceNotification';
import { BoardConfig } from './BoardConfig';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(
    readonly httpClient: HttpClient,
    readonly bus: AppBusService) { }

  public async getBoardConfig(token: string): Promise<BoardConfig> {
    const data = await firstValueFrom(this.httpClient.get("assets/boards/board1.json")) as BoardJson;
    const rowCount = data.rows.length;
    const columnCount = data.rows.reduce((prevMax, column) => {
      if (column.length > prevMax) {
        return column.length;
      }
      return prevMax;
    }, 0);

    timer(1000)
      .subscribe(() => this.notifySpace(0, 1, { teamToken: { id: "assets/team-tokens/snowflake-green.svg" } }))

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

  public notifySpace(rowIndex: number, columnIndex: number, notification: SpaceNotification): void {
    const subjectToken = new SubjectToken<SpaceNotification>(SpaceComponent.GetNotificationTopicName(rowIndex, columnIndex), "SpaceNotification");
    this.bus.publishParam(subjectToken, notification);
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
