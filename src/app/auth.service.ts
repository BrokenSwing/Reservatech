import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token?: string = null;
  private info?: TokenInfo = null;

  constructor(private http: HttpClient) { }

  createAccount(firstName: string, lastName: string, email: string, password: string) {
    return this.http.post('/api/users', {
      firstName,
      lastName,
      email,
      password,
    }, { responseType: 'json' });
  }

  connect(email: string, password: string) {
    return this.http.post<AuthResponse>('/api/auth', {
      email,
      password,
    }).pipe(
      tap(data => this.token = data.token, () => this.token = null),
      map(data => {
        const claimsPart = data.token.split('.')[1];
        const decoded = JSON.parse(atob(claimsPart));
        return decoded as TokenInfo;
      }),
      tap(data => this.info = data, () => this.info = null)
    );
  }

  isConnected() {
    return this.token !== null;
  }

}

interface AuthResponse {
  userId: number;
  token: string;
}

export interface TokenInfo {
  userId: number;
}
