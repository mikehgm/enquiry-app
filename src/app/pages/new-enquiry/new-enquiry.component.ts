import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LightboxModule } from 'ngx-lightbox';
import { Lightbox } from 'ngx-lightbox';
import { DomSanitizer } from '@angular/platform-browser';
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
import { EnquiryImagen } from '../../models/enquiryImagen.model';
import { environment } from '../../../environment/environment';

@Component({
  standalone: true,
  selector: 'app-new-enquiry',
  imports: [FormsModule, CommonModule, AsyncPipe, RouterLink, BackButtonComponent, LabelPipe, LightboxModule ],
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
    costo: null,
    anticipo: null,
    saldoPago: 0,
    dueDate: ''
  }
  public loading = false;
  public isEdit = false;
  public enquiryIdToEdit: number | null = null;
  public enquiryStatus =  EnquiryStatusEnum;
  public imageGallery: {
    src: string;
    thumb: string;
    caption?: string;
    imageId?: number }[] = [];
  selectedFiles: File[] = [];

  constructor(
    private alert: AlertService,
    private lightbox: Lightbox,
    private sanitizer: DomSanitizer) { }

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
      this.newEnquiry.costo = 0;
      this.newEnquiry.anticipo = 0;
      this.newEnquiry.saldoPago = 0;

      const today = new Date();
      const twoDaysLater = new Date(today);
      twoDaysLater.setDate(today.getDate() + 2);

      const formattedDate = twoDaysLater.toISOString().split('T')[0];

      this.newEnquiry.dueDate = formattedDate;
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
          data.anticipo = data.anticipo || 0;
          data.saldoPago = data.saldoPago || 0;
          data.dueDate = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
        }
        this.newEnquiry = data;

        this.loadEnquiryImages(id);
      },
      error: (err) => {
        console.error(err);
        this.showGenericError();
      }
    });
  }

  private loadEnquiryImages(id: number): void {
    this.enquiryDataService.getEnquiryImages(id).subscribe({
      next: (images: EnquiryImagen[]) => {

        this.imageGallery = images.map(img => ({
          imageId: img.enquiryImageId,
          src: (environment.apiUrl + (img.filePath ?? '')),
          thumb: (environment.apiUrl + (img.thumbnailPath ?? img.filePath ?? '')),
          caption: img.fileName
        }));

      },
      error: (err) => {
        console.error('Error al cargar imágenes', err);
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
      phone, email, message, resolution, costo, dueDate, anticipo, saldoPago
    } = enquiry;
    return { enquiryId, enquiryTypeId, enquiryStatusId, customerName, phone, email, message, resolution, costo, dueDate, anticipo, saldoPago };
  }

  getStatusLabel(id: number): string {
    return this.catalogDataService.getStatusNameById(id);
  }

  onAnticipoChange(): void {
    const costo = this.newEnquiry.costo ?? 0;
    const anticipo = this.newEnquiry.anticipo ?? 0;
    this.newEnquiry.saldoPago = Math.max(0, costo - anticipo);
  }

  openLightbox(index: number): void {
    this.lightbox.open(this.imageGallery, index);
  }

  closeLightbox(): void {
    this.lightbox.close();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.selectedFiles = Array.from(input.files);
  }

  public uploadImages(enquiryId: number): void {
    this.enquiryDataService.uploadEnquiryImages(enquiryId, this.selectedFiles).subscribe({
      next: () => {
        this.alert.success('Imágenes cargadas correctamente');
        this.selectedFiles = [];
        this.loadEnquiryImages(enquiryId);
      },
      error: (err) => {
        console.error(err);
        this.alert.error('Error', 'No se pudieron subir las imágenes.');
      }
    });
  }

  deleteImage(imageId: number): void {
    this.alert.confirm({
      title: '¿Eliminar imagen?',
      text: 'Esta acción no se puede deshacer. ¿Deseas continuar?',
      confirmColor: '#dc3545'
    }).then(result => {
      if (result.isConfirmed) {
        this.enquiryDataService.deleteEnquiryImage(imageId).subscribe({
          next: () => {
            this.alert.success('Imagen eliminada correctamente');
            this.loadEnquiryImages(this.newEnquiry.enquiryId!); // recargar lista
          },
          error: (err) => {
            console.error(err);
            this.alert.error('Error', 'No se pudo eliminar la imagen.');
          }
        });
      }
    });
  }

  clearZero(field: 'costo' | 'anticipo') {
    if (this.newEnquiry[field] === 0) {
      this.newEnquiry[field] = null;
    }
  }

  get isResolved(): boolean {
    return this.newEnquiry.enquiryStatusId === EnquiryStatusEnum.RESOLVED;
  }

  private showGenericError(message: string = 'Hubo un error inesperado, favor de intentar de nuevo.') {
    this.alert.error('Error', message);
  }

}
