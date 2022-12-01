import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BoardComponent } from './board/board.component';
import { SpaceComponent } from './space/space.component';
import { BusModule } from './bus/bus.module';
import { SpaceContentComponent } from './space-content/space-content.component';
import { DomainModule } from './domain/domain.module';
import { BackendModule } from './backend/backend.module';
import { TeamInputComponent } from './team-input/team-input.component';
import { DevUtilComponent } from './dev-util/dev-util.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ActionHistoryComponent } from './action-history/action-history.component';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    SpaceComponent,
    SpaceContentComponent,
    TeamInputComponent,
    DevUtilComponent,
    ActionHistoryComponent
  ],
  imports: [
    BusModule,
    MatButtonModule,
    MatSelectModule,
    MatBadgeModule,
    DomainModule,
    BackendModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
