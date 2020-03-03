import { Component, OnInit } from '@angular/core';
import { Event } from '../event';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
})
export class EventComponent implements OnInit {

  event: Event;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe((data: { event: Event }) => {
      this.event = data.event;
    });
  }

}
