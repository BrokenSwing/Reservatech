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

  updateEvent(eventId: number, organizationId: number, name: string, description: string) {
    return this.http.patch<Event>(`/api/organizations/${organizationId}/events/${eventId}`, {
      name,
      description,
    }, { headers: { Authorization: this.authService.authorizationHeader }});
  }

  deleteEvent(eventId: number, organizationId: number) {
    return this.http.delete<void>(`/api/organizations/${organizationId}/events/${eventId}`, {
      headers: {
        Authorization: this.authService.authorizationHeader,
      }
    });
  }

  participate(eventId: number, organizationId: number) {
    return this.http.post<Event>(`/api/organizations/${organizationId}/events/${eventId}/participants`, {}, {
      headers: {
        Authorization: this.authService.authorizationHeader,
      }
    });
  }

  getAllParticipants(eventId: number, organizationId: number) {
    return this.http.get<number[]>(`/api/organizations/${organizationId}/events/${eventId}/participants`);
  }

  stopParticipating(eventId: number, organizationId: number) {
    return this.http.delete<Event>(`/api/organizations/${organizationId}/events/${eventId}/participants`, {
      headers: {
        Authorization: this.authService.authorizationHeader,
      }
    });
  }

}
