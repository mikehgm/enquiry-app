import { TestBed } from '@angular/core/testing';

import { CatalogDataService } from './catalog-data.service';

describe('CatalogDataService', () => {
  let service: CatalogDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatalogDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
