import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BoardComponent } from './board/board.component';
import { SpaceComponent } from './space/space.component';
import { BusModule } from './bus/bus.module';
import { HttpClientModule } from '@angular/common/http';
import { SpaceContentComponent } from './space-content/space-content.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    SpaceComponent,
    SpaceContentComponent
  ],
  imports: [
    BusModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
