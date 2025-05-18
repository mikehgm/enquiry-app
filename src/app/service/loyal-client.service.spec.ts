import { TestBed } from '@angular/core/testing';

import { LoyalClientService } from './loyal-client.service';

describe('LoyalClientService', () => {
  let service: LoyalClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoyalClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
