import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../environment/environment';
import { EnquiryStatus } from '../models/status.model';
import { EnquiryType } from '../models/type.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogDataService {
  private apiUrl = `${environment.apiUrl}/api/Catalogs`;
  private statuses: EnquiryStatus[] = [];
  private types: EnquiryType[] = [];

  constructor(private http: HttpClient) {}

  getStatuses(): Observable<EnquiryStatus[]> {
    if (this.statuses.length) {
      return of(this.statuses);
    }
    return this.http.get<EnquiryStatus[]>(`${this.apiUrl}/enquiry-status`).pipe(
      tap(data => this.statuses = data)
    );
  }

  updateStatus(status: EnquiryStatus): Observable<any> {
    return this.http.put(`${this.apiUrl}/enquiry-status/${status.statusId}`, status);
  }

  getTypes(): Observable<EnquiryType[]> {
    if (this.types.length) {
      return of(this.types);
    }
    return this.http.get<EnquiryType[]>(`${this.apiUrl}/enquiry-type`).pipe(
      tap(data => this.types = data)
    );
  }

  updateType(type: EnquiryType): Observable<any> {
    return this.http.put(`${this.apiUrl}/enquiry-type/${type.typeId}`, type);
  }

  getStatusNameById(id: number): string {
    const match = this.statuses.find(s => s.statusId === id);
    return match?.status ?? 'Desconocido';
  }

  getTypeNameById(id: number): string {
    const match = this.types.find(t => t.typeId === id);
    return match?.typeName ?? 'Desconocido';
  }
}
