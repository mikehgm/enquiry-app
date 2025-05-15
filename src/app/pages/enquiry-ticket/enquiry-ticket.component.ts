// 📁 enquiry-ticket.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import { EnquiryDataService } from '../../service/enquiry-data.service';
import { Enquiry } from '../../models/enquiry.model';
import { AlertService } from '../../service/alert.service';

@Component({
  selector: 'app-enquiry-ticket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enquiry-ticket.component.html',
  styleUrl: './enquiry-ticket.component.css'
})
export class EnquiryTicketComponent implements OnInit {
  enquiryId: number = 0;
  enquiry: Enquiry | null = null;

  private route = inject(ActivatedRoute);
  private enquiryService = inject(EnquiryDataService);
  private alert = inject(AlertService);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.enquiryId = +params['id'];
      if (this.enquiryId) {
        this.enquiryService.getEnquiryById(this.enquiryId).subscribe({
          next: (res) => this.enquiry = res,
          error: (err) => console.error('Error loading enquiry', err)
        });
      }
    });
  }

  public getStatusLabel(statusId: number): string {
    switch (statusId) {
      case 1: return 'New';
      case 2: return 'In Progress';
      case 3: return 'On Hold';
      case 4: return 'Resolved';
      default: return 'Unknown';
    }
  }

  public getTypeLabel(typeId: number): string {
    switch (typeId) {
      case 1: return 'Wedding';
      case 2: return 'Birthday';
      case 3: return 'Party';
      case 4: return 'Meeting';
      default: return 'Unknown';
    }
  }

  sendByEmail(): void {
    if (!this.enquiry?.enquiryId) return;

    this.enquiryService.sendTicketByEmail(this.enquiry.enquiryId).subscribe({
      next: () => this.alert.success('Correo enviado', 'El ticket fue enviado exitosamente.'),
      error: (err) => {
        console.error(err);
        this.alert.error('Error', 'No se pudo enviar el correo.');
      }
    });
  }

  sendByWhatsApp(): void {
    const ticketElement = document.getElementById('ticket-content');

    if (!ticketElement) {
      console.error('No se encontró el contenido del ticket.');
      return;
    }

    html2canvas(ticketElement).then(canvas => {
      canvas.toBlob(blob => {
        if (!blob) return;

        // Descargar imagen del ticket
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ticket-${this.enquiry?.folio ?? 'nuevo'}.png`;
        link.click();

        const rawPhone = this.enquiry?.phone ?? '';
        const phone = rawPhone.replace(/\D/g, '');

        const message = `Hola ${this.enquiry?.customerName}, aquí tienes su ticket "${this.enquiry?.folio ?? ''}", gracias por su preferencia.`;

        const waUrl = `https://wa.me/+52${phone}?text=${encodeURIComponent(message)}`;

        window.open(waUrl, '_blank');
      });
    });
  }
}
