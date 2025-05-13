import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/Users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/GetAllUsers`);
  }

  updateUser(id: number, userData: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateUser/${id}`, userData);
  }

  createUser(user: Partial<User>) {
    return this.http.post(`${this.apiUrl}/RegisterUser`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteUser/${id}`);
  }
}
