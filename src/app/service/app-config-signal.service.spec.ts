import { TestBed } from '@angular/core/testing';

import { AppConfigSignalService } from './app-config-signal.service';

describe('AppConfigSignalService', () => {
  let service: AppConfigSignalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppConfigSignalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
