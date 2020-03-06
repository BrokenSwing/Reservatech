import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';

const STORAGE_KEY = 'jwtTokenReservatech';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token?: string = null;
  private info?: TokenInfo = null;

  constructor(private http: HttpClient) {
    if (localStorage.getItem(STORAGE_KEY)) {
      this.token = localStorage.getItem(STORAGE_KEY);
      this.info = AuthService.decodeToken(this.token);
    }
  }

  get authorizationHeader() {
    return `Bearer ${this.token}`;
  }

  private static decodeToken(token: string): TokenInfo {
    const claimsPart = token.split('.')[1];
    const decoded = JSON.parse(atob(claimsPart));
    return decoded as TokenInfo;
  }

  createAccount(firstName: string, lastName: string, email: string, password: string) {
    return this.http.post('/api/users', {
      firstName,
      lastName,
      email,
      password,
    }, { responseType: 'json' });
  }

  getUserInfo() {
    return this.info;
  }

  connect(email: string, password: string) {
    return this.http.post<AuthResponse>('/api/auth', {
      email,
      password,
    }).pipe(
      tap(data => this.token = data.token, () => this.token = null),
      map(data => AuthService.decodeToken(data.token)),
      tap(data => {
        this.info = data;
        localStorage.setItem(STORAGE_KEY, this.token);
      }, () => this.info = null)
    );
  }

  disconnect() {
    localStorage.removeItem(STORAGE_KEY);
    this.info = null;
    this.token = null;
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
