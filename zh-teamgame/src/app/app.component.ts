import { Component, OnInit } from '@angular/core';
import { switchMap, take } from 'rxjs';
import { BackendService, GameStartState, Board as BackendBoard } from './backend/backend.service';
import { BoardService } from './board/board.service';
import { BoardConfig } from './board/BoardConfig';
import { GameService } from './domain/game/game.service';
import { SpaceConfig } from './space/SpaceConfig';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'zh-teamgame';
  boardConfig?: BoardConfig;
  constructor(
    readonly boardService: BoardService,
    readonly gameService: GameService,
    readonly backend: BackendService) { }
  async ngOnInit(): Promise<void> {
    const startingSubscription = this.backend.starting$.pipe(
      switchMap(async s => await this.OnStarting(s))
    ).subscribe();

    //simulate the backend pushing a new game to us
    this.backend.bootStrapStart();

    const gameSubscription = this.gameService.starting$.observable$.pipe(
      take(1),
      switchMap(async d => {

      })
    ).subscribe();


  }
  private async OnStarting(state: GameStartState): Promise<void> {
    this.boardConfig = this.getBoardConfig(state.board);

    //this is a hack to allow the board to render so that the spaces will subscribe to notifications
    await new Promise(resolve => setTimeout(() => { resolve(1); }, 1));

    for (const team of state.teams) {
      this.boardService.notifySpace(team.location.row, team.location.column, { teamToken: { id: team.id } });
    }
    await this.gameService.start(state);
  }

  public getBoardConfig(data: BackendBoard): BoardConfig {
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
  private lookupFunctionFactory(board: BackendBoard): (rowIndex: number, columnIndex: number) => SpaceConfig {
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
