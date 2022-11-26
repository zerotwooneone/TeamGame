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
  boardConfig?: BoardConfig;
  constructor(readonly boardService: BoardService) { }
  async ngOnInit(): Promise<void> {
    const boardConfig = await this.boardService.getBoardConfig("");
    this.boardConfig = boardConfig;
  }
}
