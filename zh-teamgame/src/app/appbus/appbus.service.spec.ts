import { TestBed } from '@angular/core/testing';

import { AppBusService } from './appbus.service';

describe('AppbusService', () => {
  let service: AppBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppBusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
