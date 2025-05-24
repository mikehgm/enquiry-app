import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Enquiry } from '../models/enquiry.model';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { EnquiryImagen } from '../models/enquiryImagen.model';


@Injectable({
  providedIn: 'root'
})
export class EnquiryDataService {

  constructor(private http: HttpClient) { }
  getEnquiries() {
    return this.http.get<Enquiry[]>(`${environment.apiUrl}/api/EnquiryData/GetEnquiries`);
  }
  getAllEnquiries() {
    return this.http.get<Enquiry[]>(`${environment.apiUrl}/api/EnquiryData/GetAllEnquiries`);
  }

  getEnquiryById(enquiryId: number) {
    return this.http.get<Enquiry>(`${environment.apiUrl}/api/EnquiryData/GetEnquiryById/${enquiryId}`);
  }

  getAllTypes() {
    return this.http.get(`${environment.apiUrl}/api/EnquiryData/GetAllTypes`);
  }

  getAllStatus() {
    return this.http.get(`${environment.apiUrl}/api/EnquiryData/GetAllStatus`);
  }

  updateEnquiry(enquiry: Partial<Enquiry>) {
    return this.http.put(`${environment.apiUrl}/api/EnquiryData/UpdateEnquiry`, enquiry);
  }

  deleteEnquiry(enquiryId: number) {
    return this.http.delete(`${environment.apiUrl}/api/EnquiryData/DeleteEnquiry/${enquiryId}`);
  }

  // This method is used to create a new enquiry
  createEnquiry(enquiry: Enquiry) {
    return this.http.post<Enquiry>(`${environment.apiUrl}/api/EnquiryData/CreateNewEnquiry`, enquiry);
  }

  sendTicketByEmail(enquiryId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/EnquiryData/SendTicketEmail/${enquiryId}`, {});
  }

  archiveEnquiry(enquiryId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/EnquiryData/ArchiveEnquiry/${enquiryId}`, {});
  }

  getArchivedEnquiries(): Observable<Enquiry[]> {
    return this.http.get<Enquiry[]>(`${environment.apiUrl}/api/EnquiryData/GetArchivedEnquiries`);
  }

  getEnquiryImages(enquiryId: number): Observable<EnquiryImagen[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/EnquiryData/GetImagesByEnquiry/${enquiryId}`);
  }

  uploadEnquiryImages(enquiryId: number, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name);
    });
    return this.http.post(`${environment.apiUrl}/api/EnquiryData/UploadEnquiryImages/${enquiryId}`, formData );
  }

  deleteEnquiryImage(imageId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/EnquiryData/DeleteImage/${imageId}`);
  }

}
