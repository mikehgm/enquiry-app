import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Enquiry } from '../models/enquiry.model';
import { environment } from '../../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class EnquiryDataService {

  constructor(private http: HttpClient) { }
  getEnquiryList() {
    return this.http.get<Enquiry[]>(`${environment.apiUrl}/EnquiryData/GetAllEnquiries`);
  }

  getEnquiryById(enquiryId: number) {
    return this.http.get<Enquiry>(`${environment.apiUrl}/EnquiryData/GetEnquiryById/${enquiryId}`);
  }

  getAllTypes() {
    return this.http.get(`${environment.apiUrl}/EnquiryData/GetAllTypes`);
  }

  getAllStatus() {
    return this.http.get(`${environment.apiUrl}/EnquiryData/GetAllStatus`);
  }

  updateEnquiry(enquiry: Partial<Enquiry>) {
    return this.http.put(`${environment.apiUrl}/EnquiryData/UpdateEnquiry`, enquiry);
  }

  deleteEnquiry(enquiryId: number) {
    return this.http.delete(`${environment.apiUrl}/EnquiryData/DeleteEnquiry/${enquiryId}`);
  }

  // This method is used to create a new enquiry
  createEnquiry(enquiry: Enquiry) {
    return this.http.post<Enquiry>(`${environment.apiUrl}/EnquiryData/CreateNewEnquiry`, enquiry);
  }
}
