import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AccessToken, LoginData, RegisterData, User} from '../state/auth.model';

@Injectable()
export class AuthService {
  API_ENDPOINT = '/api/v1/';

  constructor(private readonly http: HttpClient) {
  }

  login(user: LoginData): Observable<AccessToken> {
    return this.http.post<AccessToken>(`${this.API_ENDPOINT}/auth/login/`, user);
  }

  registration(user: RegisterData): Observable<User> {
    return this.http.post<User>(`${this.API_ENDPOINT}/user/register/`, user);
  }

  getUser(): Observable<User> {
    const url = `${this.API_ENDPOINT}/user/`;
    return this.http.get<User>(url, {headers: this.getAuthHeaders()});
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
    });
  }
}
