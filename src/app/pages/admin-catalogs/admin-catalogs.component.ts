import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { BackButtonComponent } from "../../shared/back-button/back-button.component";
import { LabelPipe } from '../../pipes/label.pipe';

@Component({
  selector: 'app-admin-catalogs',
  imports: [RouterOutlet, RouterModule, BackButtonComponent, LabelPipe],
  templateUrl: './admin-catalogs.component.html',
  styleUrl: './admin-catalogs.component.css'
})
export class AdminCatalogsComponent {

}
