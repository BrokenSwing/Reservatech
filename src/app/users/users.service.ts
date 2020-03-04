import { Injectable } from '@angular/core';
import {AuthService} from '../auth.service';
import {HttpClient} from '@angular/common/http';
import {User} from './user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  getConnectedUser() {
    return this.http.get<User>(`/api/users/${this.authService.getUserInfo().userId}`, {
      headers: {
        Authorization: this.authService.authorizationHeader,
      }
    });
  }

  updateUser(id: number, values: { firstName?: string, lastName?: string, email?: string, password?: string}) {
    return this.http.patch<User>(`/api/users/${id}`, values, {
      headers: {
        Authorization: this.authService.authorizationHeader,
      }
    });
  }

}
