import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environment/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfigSignalService {
  private hubConnection!: signalR.HubConnection;
  public configChanged$ = new Subject<void>();

  public startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hubs/appconfig`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('✅ SignalR AppConfig conectado'))
      .catch(err => console.error('❌ Error en AppConfig SignalR:', err));

    this.hubConnection.on('AppConfigChanged', () => {
      console.log('🔔 AppConfigChanged recibido');
      this.configChanged$.next(); // notifica a quienes están suscritos
    });
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
