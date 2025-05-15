import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/api/Auth/login`, credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserInfo(): any {
    const token = this.getToken();
    if (!token) return null;
    return jwtDecode(token);
  }

  getRole(): string | null {
    const info = this.getUserInfo();

    return (
      info?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null
    );
  }

  getEmail(): string | null {
    const info = this.getUserInfo();

    return (
      info?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || null
    );
  }

  changePassword(newPassword: string) {
    return this.http.post(`${environment.apiUrl}/api/Auth/change-password`, { newPassword });
  }

}
