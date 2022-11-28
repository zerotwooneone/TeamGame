import { Component, OnInit } from '@angular/core';
import { switchMap, take } from 'rxjs';
import { BoardService } from './board/board.service';
import { BoardConfig } from './board/BoardConfig';
import { GameService } from './domain/game/game.service';
import { Team } from './domain/game/GameStartConfig';

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
    readonly gameService: GameService) { }
  async ngOnInit(): Promise<void> {

    this.gameService.create("some game id");

    const gameSubscription = this.gameService.starting$.observable$.pipe(
      take(1),
      switchMap(async d => {

      })
    ).subscribe();

    const boardJson = await this.boardService.getBoardJson("");
    this.boardConfig = this.boardService.getBoardConfig(boardJson);
    const gameStartState = {
      board: boardJson,
      teams: [
        { id: "assets/team-tokens/snowflake-green.svg", location: { row: 0, column: 1 } },
        { id: "assets/team-tokens/stars.svg", location: { row: 3, column: 4 } }
      ]
    };

    //this is a hack to allow the board to render so that the spaces will subscribe to notifications
    await new Promise(resolve => setTimeout(() => { resolve(1); }, 1));

    for (const team of gameStartState.teams as Team[]) {
      this.boardService.notifySpace(team.location.row, team.location.column, { teamToken: { id: team.id } });
    }
    await this.gameService.start(gameStartState);
  }

}
