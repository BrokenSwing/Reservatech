import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Event} from './event';
import {AuthService} from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getEvent(id: number) {
    return this.http.get<Event>(`/api/events/${id}`);
  }

  getAllEvents() {
    return this.http.get<Event[]>('/api/events');
  }

  createEvent(name: string, description: string, maxParticipants: number, beginning: string, end: string, organizationId: number) {
    return this.http.post<Event>(`/api/events`, {
      name,
      description,
      maxParticipants,
      beginning,
      end,
      organization: organizationId
    }, { headers: { Authorization: this.authService.authorizationHeader }});
  }

}
