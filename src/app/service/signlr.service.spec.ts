import { TestBed } from '@angular/core/testing';

import { SignlrService } from './signlr.service';

describe('SignlrService', () => {
  let service: SignlrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignlrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
