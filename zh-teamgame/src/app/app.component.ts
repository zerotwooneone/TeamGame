import { Component, OnInit } from '@angular/core';
import { BoardService } from './board/board.service';
import { BoardConfig } from './board/BoardConfig';
import { SpaceConfig } from './space/SpaceConfig';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'zh-teamgame';
  boardConfig: BoardConfig = {
    columnCount: 1,
    rowCount: 1,
    columnSize: 1,
    rowSize: 1,
    getSpaceConfig: this.dummyGetSpaceConfig.bind(this)
  };
  constructor(readonly boardService: BoardService) { }
  async ngOnInit(): Promise<void> {
    const boardConfig = await this.boardService.getBoardConfig("");
    this.boardConfig = boardConfig;
  }
  private dummyGetSpaceConfig(rowIndex: number, columnIndex: number): SpaceConfig {
    return {
      columnIndex: 1,
      rowIndex: 1,
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
      }
    };
  }
}
