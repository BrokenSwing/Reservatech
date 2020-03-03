import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventComponent } from './event/event.component';
import { EventsListComponent } from './events-list/events-list.component';


@NgModule({
  declarations: [EventComponent, EventsListComponent],
  imports: [
    CommonModule,
    EventsRoutingModule
  ]
})
export class EventsModule { }
