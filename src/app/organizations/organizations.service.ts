import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Organization} from './organization';
import {mergeMap} from 'rxjs/operators';
import {UsersService} from '../users/users.service';
import {forkJoin} from 'rxjs';
import {Event} from '../events/event';
import {AuthService} from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationsService {

  constructor(private http: HttpClient, private usersService: UsersService, private authService: AuthService) { }

  getAllOrganizations() {
    return this.http.get<Organization[]>('/api/organizations');
  }

  getOrganization(id: number) {
    return this.http.get<Organization>(`/api/organizations/${id}`);
  }

  getMembersIdsFor(organizationId: number) {
    return this.http.get<number[]>(`/api/organizations/${organizationId}/members`);
  }

  getMembersFor(organizationId: number) {
    return this.getMembersIdsFor(organizationId).pipe(
      mergeMap((ids) => forkJoin(ids.map((id) => this.usersService.getUser(id))))
    );
  }

  getEventsFor(organizationId: number) {
    return this.http.get<Event[]>(`/api/organizations/${organizationId}/events`);
  }

  createOne(name: string, description: string) {
    return this.http.post<Organization>('/api/organizations', {
      name,
      description,
    }, { headers: { Authorization: this.authService.authorizationHeader }});
  }

  patchOne(id: number, name: string, description: string) {
    return this.http.patch<Organization>(`/api/organizations/${id}`, {
      name,
      description,
    }, { headers: { Authorization: this.authService.authorizationHeader }});
  }

  addMember(organizationId: number, userEmail: string) {
    return this.http.post<void>(`/api/organizations/${organizationId}/members`, {
      email: userEmail,
    }, { headers: { Authorization: this.authService.authorizationHeader }});
  }

}
