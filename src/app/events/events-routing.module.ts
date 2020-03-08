import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EventComponent} from './event/event.component';
import {EventResolverService} from './event-resolver.service';
import {EventsListComponent} from './events-list/events-list.component';
import {EventCreateComponent} from './event-create/event-create.component';
import {AuthGuard} from '../auth.guard';

const routes: Routes = [
  {
    path: 'events',
    component: EventsListComponent,
  },
  {
    path: 'events/new',
    component: EventCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'events/:id',
    component: EventComponent,
    resolve: {
      event: EventResolverService
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
