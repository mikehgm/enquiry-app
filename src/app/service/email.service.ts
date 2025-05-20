import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({ providedIn: 'root' })
export class EmailService {
  private apiUrl = `${environment.apiUrl}/api/LoyalClients`;

  constructor(private http: HttpClient) {}

  sendPromotion(
    clientId: number,
    message: string,
    method: 'email' | 'whatsapp',
    toEmail?: string,
    toPhone?: string,
    imageFile?: File,
    subject: string = 'Promoción exclusiva para ti'
  ): Observable<any> {
    const formData = new FormData();
    formData.append('ClientId', clientId.toString());
    formData.append('Message', message);
    formData.append('Method', method);

    if (method === 'email') {
      formData.append('ToEmail', toEmail || '');
      formData.append('Subject', subject);
      if (imageFile) {
        formData.append('Image', imageFile, imageFile.name);
      }
    }

    if (method === 'whatsapp') {
      formData.append('ToPhone', toPhone || '');
    }

    return this.http.post(`${this.apiUrl}/send-promotion`, formData);
  }

}
