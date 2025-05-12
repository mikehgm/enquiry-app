import { TestBed } from '@angular/core/testing';

import { EnquiryDataService } from './enquiry-data.service';

describe('EnquiryDataService', () => {
  let service: EnquiryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnquiryDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
