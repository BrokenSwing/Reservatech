import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EventComponent} from './event/event.component';
import {EventResolverService} from './event-resolver.service';
import {EventsListComponent} from './events-list/events-list.component';

const routes: Routes = [
  {
    path: '',
    component: EventsListComponent,
  },
  {
    path: ':id',
    component: EventComponent,
    resolve: {
      event: EventResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
