import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/header/header.component";
import { SearchDataService } from './service/search-data.service';
import { SignalRService } from './service/signlr.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'enquiry-app';

  constructor(private searchDataService: SearchDataService, private signalRService: SignalRService) {}

  ngOnInit() {
    this.signalRService.startConnection();
  }
  ngOnDestroy() {
    this.signalRService.stopConnection();
  }

  onSearchChanged(searchTerm: string) {
    this.searchDataService.setSearchTerm(searchTerm);
  }
}
