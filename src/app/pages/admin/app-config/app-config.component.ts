import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfigItem } from '../../../models/app-config.model';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../../service/app-config.service';
import { Toast } from 'bootstrap';

@Component({
  standalone: true,
  selector: 'app-app-config',
  imports: [CommonModule, FormsModule],
  templateUrl: './app-config.component.html',
  styleUrl: './app-config.component.css'
})
export class AppConfigComponent {

  items: ConfigItem[] = [];
  filtered: ConfigItem[] = [];
  searchTerm: string = '';

  @ViewChild('toastRef', { static: true }) toastRef!: ElementRef;

  constructor(private http: HttpClient, private appConfigService: AppConfigService) {}

  ngOnInit(): void {
    this.appConfigService.getAll().subscribe(data => {
      this.items = data;
      this.filtered = [...this.items];
    });
  }

  save(item: ConfigItem): void {
    this.appConfigService.updateLabel(item.key, item.label).subscribe(() => {
      const toast = new Toast(this.toastRef.nativeElement);
      toast.show();

      this.appConfigService.loadConfig();
    });
  }

  filter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filtered = this.items.filter(item =>
      item.key.toLowerCase().includes(term) ||
      item.label.toLowerCase().includes(term)
    );
  }

}
