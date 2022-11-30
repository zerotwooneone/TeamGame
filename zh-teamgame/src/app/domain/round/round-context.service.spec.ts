import { TestBed } from '@angular/core/testing';

import { RoundContextService } from './round-context.service';

describe('RoundContextService', () => {
  let service: RoundContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoundContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
