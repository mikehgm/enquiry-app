import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/header/header.component";
import { SearchDataService } from './service/search-data.service';
import { SignalRService } from './service/signlr.service';
import { LoadingOverlayComponent } from "./shared/loading-overlay/loading-overlay.component";
import { AppConfigSignalService } from './service/app-config-signal.service';
import { AppConfigService } from './service/app-config.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent, LoadingOverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'enquiry-app';

  constructor(
    private searchDataService: SearchDataService,
    private signalRService: SignalRService,
    private appConfigSignal: AppConfigSignalService,
    private appConfig: AppConfigService) {}

  ngOnInit() {
    this.signalRService.startConnection();
    this.appConfigSignal.startConnection();
    this.appConfigSignal.configChanged$.subscribe(() => {
      this.appConfig.loadConfig();
    });
  }
  ngOnDestroy() {
    this.signalRService.stopConnection();
    this.appConfigSignal.stopConnection();
  }

  onSearchChanged(searchTerm: string) {
    this.searchDataService.setSearchTerm(searchTerm);
  }

  isReady(): boolean {
    return this.appConfig.isConfigLoaded;
  }
}
