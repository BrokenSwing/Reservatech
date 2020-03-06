import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Organization} from './organization';

@Injectable({
  providedIn: 'root'
})
export class OrganizationsService {

  constructor(private http: HttpClient) { }

  getAllOrganizations() {
    return this.http.get<Organization[]>('/api/organizations');
  }

  getOrganization(id: number) {
    return this.http.get<Organization>(`/api/organizations/${id}`);
  }

  getMembersIdsFor(organizationId: number) {
    return this.http.get<number[]>(`/api/organizations/${organizationId}/members`);
  }

}
