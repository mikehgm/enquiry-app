// services/loyal-client.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { LoyalClient } from '../models/loyalClient.model';

@Injectable({ providedIn: 'root' })
export class LoyalClientService {
  private apiUrl = `${environment.apiUrl}/api/LoyalClients`;

  constructor(private http: HttpClient) {}

  getLoyalClients(min: number = 5, period: number = 30): Observable<LoyalClient[]> {
    return this.http.get<LoyalClient[]>(`${this.apiUrl}?min=${min}&period=${period}`);
  }
}
