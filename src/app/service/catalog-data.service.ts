import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { EnquiryStatus } from '../models/status.model';
import { EnquiryType } from '../models/type.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogDataService {
  private apiUrl = `${environment.apiUrl}/api/Catalogs`;

  constructor(private http: HttpClient) {}

  getStatuses(): Observable<EnquiryStatus[]> {
    return this.http.get<EnquiryStatus[]>(`${this.apiUrl}/enquiry-status`);
  }

  updateStatus(status: EnquiryStatus): Observable<any> {
    return this.http.put(`${this.apiUrl}/enquiry-status/${status.statusId}`, status);
  }

  getTypes(): Observable<EnquiryType[]> {
    return this.http.get<EnquiryType[]>(`${this.apiUrl}/enquiry-type`);
  }

  updateType(type: EnquiryType): Observable<any> {
    return this.http.put(`${this.apiUrl}/enquiry-type/${type.typeId}`, type);
  }
}
