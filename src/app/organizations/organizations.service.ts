import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Organization} from './organization';
import {mergeMap} from 'rxjs/operators';
import {UsersService} from '../users/users.service';
import {forkJoin} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationsService {

  constructor(private http: HttpClient, private usersService: UsersService) { }

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

}
