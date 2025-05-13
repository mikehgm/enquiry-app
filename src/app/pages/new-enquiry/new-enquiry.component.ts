import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EnquiryDataService } from '../../service/enquiry-data.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Enquiry } from '../../models/enquiry.model';
import { AlertService } from '../../service/alert.service';

@Component({
  selector: 'app-new-enquiry',
  imports: [FormsModule, CommonModule, AsyncPipe],
  templateUrl: './new-enquiry.component.html',
  styleUrl: './new-enquiry.component.css'
})
export class NewEnquiryComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private enquiryDataService = inject(EnquiryDataService);
  public typeList: Observable<any> = new Observable<any>();
  public statusList: Observable<any> = new Observable<any>();
  public newEnquiry: Enquiry = {
    enquiryId: 0,
    enquiryTypeId: 0,
    enquiryStatusId: 0,
    customerName: '',
    phone: '',
    email: '',
    message: '',
    createdDate: new Date(),
    resolution: ''
  }
  public loading = false;
  public isEdit = false;
  public enquiryIdToEdit: number | null = null;

  constructor(private alert: AlertService) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.enquiryIdToEdit = Number(idParam);
      this.enquiryDataService.getEnquiryById(this.enquiryIdToEdit).subscribe({
        next: (data: Enquiry) => this.newEnquiry = data,
        error: (err) => {
          console.error('Error fetching enquiry:', err);
          this.alert.error('Error al leer el registro', 'Hubo un error inesperado, favor de intentar de nuevo.');
        }
      });
    } else {
      this.newEnquiry.enquiryStatusId = 1;
    }

    this.typeList = this.enquiryDataService.getAllTypes();
    this.statusList = this.enquiryDataService.getAllStatus();
  }

  public onSubmit() {
    this.loading = true;

    if (this.isEdit) {
      this.enquiryDataService.updateEnquiry(this.newEnquiry).subscribe({
        next: () => {
          this.alert.success(this.isEdit ? 'Enquiry actualizado' : 'Enquiry creado', this.isEdit
              ? 'Los cambios fueron guardados correctamente.'
              : 'El nuevo enquiry fue agregado con éxito.');

          this.loading = false;
        },
        error: (err) => {
          console.error('Error update enquiry:', err);
          this.alert.error('Error al guardar los cambios', 'Hubo un error inesperado, favor de intentar de nuevo.');
          this.loading = false;
        }
      });
    } else {
      console.log(this.newEnquiry);
      this.enquiryDataService.createEnquiry(this.newEnquiry).subscribe({
        next: (response) => {
          console.log(response);
          this.alert.success('Guardado correctamente', 'El registro fue guardado exitosamente.');
        },
        error: (error) => {
          this.alert.error('Error al crear el registro', 'Hubo un error inesperado, favor de intentar de nuevo.');
          console.error(error);
          this.loading = false;
        }
      });
    }
  }
}
