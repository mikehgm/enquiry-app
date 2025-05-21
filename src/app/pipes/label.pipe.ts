import { Pipe, PipeTransform } from '@angular/core';
import { inject } from '@angular/core';
import { AppConfigService } from '../service/app-config.service';

@Pipe({
  name: 'label',
  standalone: true
})
export class LabelPipe implements PipeTransform {
  private config = inject(AppConfigService);

  transform(key: string): string {
    const label = this.config.getLabel(key);
    return label;
  }
}
