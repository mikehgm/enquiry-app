import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EnquiryDataService } from '../../service/enquiry-data.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Enquiry } from '../../models/enquiry.model';
import { AlertService } from '../../service/alert.service';
import { parseLocalDate } from '../../utils/date-utils';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';
import { CatalogDataService } from '../../service/catalog-data.service';
import { EnquiryStatusEnum } from '../../models/enquiry-status.enum';
import { LabelPipe } from '../../pipes/label.pipe';

@Component({
  selector: 'app-new-enquiry',
  imports: [FormsModule, CommonModule, AsyncPipe, RouterLink, BackButtonComponent, LabelPipe],
  templateUrl: './new-enquiry.component.html',
  styleUrl: './new-enquiry.component.css'
})
export class NewEnquiryComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private enquiryDataService = inject(EnquiryDataService);
  private catalogDataService = inject(CatalogDataService);
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
    createdDate: '',
    resolution: '',
    createdBy: '',
    updatedBy: '',
    updatedAt: '',
    folio: '',
    costo: 0,
    dueDate: ''
  }
  public loading = false;
  public isEdit = false;
  public enquiryIdToEdit: number | null = null;
  public enquiryStatus =  EnquiryStatusEnum;

  constructor(private alert: AlertService) { }

  ngOnInit(): void {
    this.loadCatalogs();
    this.checkEditMode();
  }

  private loadCatalogs(): void {
    this.statusList = this.catalogDataService.getStatuses();
    this.typeList = this.catalogDataService.getTypes();
  }

  private checkEditMode(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.newEnquiry.enquiryStatusId = 1;
      return;
    }

    this.isEdit = true;
    this.enquiryIdToEdit = Number(idParam);
    this.loadEnquiry(this.enquiryIdToEdit);
  }

  private loadEnquiry(id: number): void {
    this.enquiryDataService.getEnquiryById(id).subscribe({
      next: (data: Enquiry) => {
        if (data.dueDate) {
          const fecha = parseLocalDate(data.dueDate);
          data.dueDate = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
        }
        this.newEnquiry = data;
      },
      error: (err) => {
        console.error(err);
        this.showGenericError();
      }
    });
  }


  public onSubmit() {
    this.loading = true;

    if (this.isEdit) {
      this.enquiryDataService.updateEnquiry(this.toDto(this.newEnquiry)).subscribe({
        next: () => {
          this.alert.success(this.isEdit ? 'Enquiry actualizado' : 'Enquiry creado', this.isEdit
              ? 'Los cambios fueron guardados correctamente.'
              : 'El nuevo enquiry fue agregado con éxito.');

          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.showGenericError();
          this.loading = false;
        }
      });
    } else {
      console.log(this.newEnquiry);
      this.enquiryDataService.createEnquiry(this.newEnquiry).subscribe({
        next: (response: Enquiry) => {
          console.log(response);
          this.newEnquiry = response
          this.alert.success('Guardado correctamente', 'El registro fue guardado exitosamente.');
          this.loading = false;
        },
        error: (error) => {
          console.error(error);
          this.showGenericError();
          this.loading = false;
        }
      });
    }
  }

  updateStatus(statusId: number): void {

    if (this.newEnquiry.enquiryStatusId === statusId) {
      this.alert.info('Sin cambios', 'El estado ya es el seleccionado.');
      return;
    }

    if (statusId === 4 && !this.newEnquiry.resolution) {
      this.alert.error('Falta información', 'Agrega una resolución antes de marcar como Resuelto.');
      return;
    }

    if ((statusId === 2 || statusId === 3) && !this.newEnquiry.message) {
      this.alert.error('Falta mensaje', 'Agrega un mensaje antes de actualizar el estado.');
      return;
    }

    this.newEnquiry.enquiryStatusId = statusId;

    // Guardar el cambio como si fuera un submit
    this.enquiryDataService.updateEnquiry(this.toDto(this.newEnquiry)).subscribe({
      next: () => {
        this.alert.success('Enquiry actualizado');
      },
      error: (error) => {
        console.error(error);
        this.showGenericError('No se pudo actualizar el estado del enquiry');
      }
    });
  }

  toDto(enquiry: Enquiry): Partial<Enquiry> {
    const {
      enquiryId, enquiryTypeId, enquiryStatusId, customerName,
      phone, email, message, resolution, costo, dueDate
    } = enquiry;
    return { enquiryId, enquiryTypeId, enquiryStatusId, customerName, phone, email, message, resolution, costo, dueDate };
  }

  getStatusLabel(id: number): string {
    return this.catalogDataService.getStatusNameById(id);
  }

  private showGenericError(message: string = 'Hubo un error inesperado, favor de intentar de nuevo.') {
    this.alert.error('Error', message);
  }

}
