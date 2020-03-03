import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Event} from './event';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http: HttpClient) { }

  getEvent(id: number) {
    return this.http.get<Event>(`/api/events/${id}`);
  }

  getAllEvents() {
    return this.http.get<Event[]>('/api/events');
  }

}
