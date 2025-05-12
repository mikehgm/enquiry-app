import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/header/header.component";
import { SearchDataService } from './service/search-data.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'enquiry-app';

  constructor(private searchDataService: SearchDataService) {}

  onSearchChanged(searchTerm: string) {
    this.searchDataService.setSearchTerm(searchTerm);
  }
}
