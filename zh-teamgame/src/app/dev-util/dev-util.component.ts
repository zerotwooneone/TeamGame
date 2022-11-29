import { Component } from '@angular/core';
import { BackendService } from '../backend/backend.service';

@Component({
  selector: 'zh-dev-util',
  templateUrl: './dev-util.component.html',
  styleUrls: ['./dev-util.component.scss']
})
export class DevUtilComponent {
  constructor(readonly backend: BackendService) { }
  onStartRound() {
    this.backend.startNewRound();
  }
}
