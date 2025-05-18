import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({ providedIn: 'root' })
export class EmailService {
  private apiUrl = `${environment.apiUrl}/api/LoyalClients`;

  constructor(private http: HttpClient) {}

  sendPromotion(
    toEmail: string,
    message: string,
    imageFile?: File,
    subject: string = 'Promoción exclusiva para ti'
  ): Observable<any> {
    const formData = new FormData();
    formData.append('ToEmail', toEmail);
    formData.append('Message', message);
    formData.append('Subject', subject);

    if (imageFile) {
      formData.append('Image', imageFile, imageFile.name);
    }

    return this.http.post(`${this.apiUrl}/send-promotion`, formData);
  }
}
