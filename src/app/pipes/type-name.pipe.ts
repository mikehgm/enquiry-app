import { Pipe, PipeTransform } from '@angular/core';
import { inject } from '@angular/core';
import { CatalogDataService } from '../service/catalog-data.service';

@Pipe({
  name: 'typeName',
  standalone: true
})
export class TypeNamePipe implements PipeTransform {
  private catalogService = inject(CatalogDataService);

  transform(typeId: number): string {
    return this.catalogService.getTypeNameById(typeId);
  }
}
