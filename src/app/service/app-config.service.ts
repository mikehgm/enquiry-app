import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { firstValueFrom, Observable } from 'rxjs';
import { ConfigItem } from '../models/app-config.model';
import { LoadingService } from './loading.service';


@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private labels: Map<string, string> = new Map();
  public isConfigLoaded = false;

  constructor(private http: HttpClient, private loading: LoadingService) {}

  loadConfig(): Promise<void> {
    this.loading.show();
    return firstValueFrom(this.http.get<ConfigItem[]>(`${environment.apiUrl}/api/app-config`))
      .then(configs => {
        if (configs) {
          this.labels.clear();
          configs.forEach(entry => this.labels.set(entry.key, entry.label));
          this.isConfigLoaded = true;
          this.loading.hide();
        }
      })
      .catch(error => {
        console.error('Error cargando configuración:', error);
        this.loading.hide();
        throw error;
      });
  }

  getLabel(key: string): string {
    return this.labels.get(key) ?? `{{${key}}}`;
  }

  getAll(): Observable<ConfigItem[]> {
    return this.http.get<{ key: string; label: string }[]>(`${environment.apiUrl}/api/app-config`);
  }

  updateLabel(key: string, value: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/api/app-config/${key}`, JSON.stringify(value), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
