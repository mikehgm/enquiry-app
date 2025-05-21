import { Routes } from '@angular/router';
import { EnquiryListComponent } from './pages/enquiry-list/enquiry-list.component';
import { NewEnquiryComponent } from './pages/new-enquiry/new-enquiry.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { UserFormComponent } from './pages/admin-users/user-form/user-form.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ConfirmAccountComponent } from './pages/confirm-account/confirm-account.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AdminReportsComponent } from './pages/admin-reports/admin-reports.component';
import { EnquiryTicketComponent } from './pages/enquiry-ticket/enquiry-ticket.component';
import { ArchivedEnquiriesComponent } from './pages/admin-reports/archived-enquiries/archived-enquiries.component';
import { AdminCatalogsComponent } from './pages/admin-catalogs/admin-catalogs.component';
import { StatusListComponent } from './pages/admin-catalogs/status-list/status-list.component';
import { TypeListComponent } from './pages/admin-catalogs/type-list/type-list.component';
import { AppConfigComponent } from './pages/admin/app-config/app-config.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: EnquiryListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'enquiry/new',
    component: NewEnquiryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'enquiry/edit/:id',
    component: NewEnquiryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'enquiry/ticket/:id',
    component: EnquiryTicketComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-users',
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', component: AdminUsersComponent },
      { path: 'create', component: UserFormComponent },
      { path: 'edit/:id', component: UserFormComponent }
    ]
  },
  {
    path: 'admin/reports',
    component: AdminReportsComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/reports/archived',
    component: ArchivedEnquiriesComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'admin/catalogos',
    component: AdminCatalogsComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'status', component: StatusListComponent },
      { path: 'types', component: TypeListComponent },
      { path: '', redirectTo: 'status', pathMatch: 'full' }
    ]
  },
  {
    path: 'admin/config-ui',
    component: AppConfigComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'confirm-account',
    component: ConfirmAccountComponent
  },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] }
];
