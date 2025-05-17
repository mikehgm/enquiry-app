import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private ACCESS_TOKEN_KEY = 'auth_token';
  private REFRESH_TOKEN_KEY = 'refresh_token';

  constructor(private http: HttpClient, private router: Router) {}

  get accessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  get refreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/api/Auth/login`, credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  logout(): void {
    this.clearTokens();
    this.router.navigate(['/login']);
  }

  refreshTokens(): Observable<{ access_token: string, refresh_token: string }> {
    return this.http.post<{ access_token: string, refresh_token: string }>(
      `${environment.apiUrl}/api/Auth/refresh-token`,
      { refreshToken: this.refreshToken }
    );
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
