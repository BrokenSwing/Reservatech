import { Component, OnInit } from '@angular/core';
import {EventsService} from '../events.service';
import * as moment from 'moment';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
})
export class EventsListComponent implements OnInit {

  events: DisplayableEvent[];

  constructor(private eventsService: EventsService) { }

  ngOnInit() {
    this.eventsService.getAllEvents().subscribe((events) => this.events = events.map((e) => ({
      id: e.id,
      name: e.name,
      description: e.description,
      beginning: moment(e.beginning, undefined, 'fr').calendar(),
    })));
  }

}

interface DisplayableEvent {
  id: number;
  name: string;
  description: string;
  beginning: string;
}
