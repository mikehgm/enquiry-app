import { Pipe, PipeTransform } from '@angular/core';
import { inject } from '@angular/core';
import { CatalogDataService } from '../service/catalog-data.service';

@Pipe({
  name: 'statusName',
  standalone: true
})
export class StatusNamePipe implements PipeTransform {
  private catalogService = inject(CatalogDataService);

  transform(statusId: number): string {
    return this.catalogService.getStatusNameById(statusId);
  }
}
