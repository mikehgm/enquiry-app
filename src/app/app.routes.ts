import { Routes } from '@angular/router';
import { EnquiryListComponent } from './pages/enquiry-list/enquiry-list.component';
import { NewEnquiryComponent } from './pages/new-enquiry/new-enquiry.component';

export const routes: Routes = [
  {
    path: '',
    component: EnquiryListComponent // ✅ Show list by default
  },
  {
    path: 'enquiry/new',
    component: NewEnquiryComponent
  },
  {
    path: 'enquiry/edit/:id',
    component: NewEnquiryComponent
  }
];
