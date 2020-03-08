import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventComponent } from './event/event.component';
import { EventsListComponent } from './events-list/events-list.component';
import { EventCreateComponent } from './event-create/event-create.component';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [EventComponent, EventsListComponent, EventCreateComponent],
  imports: [
    CommonModule,
    FormsModule,
    EventsRoutingModule,
  ]
})
export class EventsModule { }
