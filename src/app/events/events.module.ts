import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventComponent } from './event/event.component';
import { EventsListComponent } from './events-list/events-list.component';
import { EventCreateComponent } from './event-create/event-create.component';
import {FormsModule} from '@angular/forms';
import {AppCommonModule} from '../app-common/app-common.module';


@NgModule({
  declarations: [EventComponent, EventsListComponent, EventCreateComponent],
    imports: [
        CommonModule,
        FormsModule,
        AppCommonModule,
        EventsRoutingModule,
    ]
})
export class EventsModule { }
