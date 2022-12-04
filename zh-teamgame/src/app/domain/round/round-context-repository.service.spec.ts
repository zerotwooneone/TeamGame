import { TestBed } from '@angular/core/testing';

import { RoundContextRepositoryService } from './round-context-repository.service';

describe('RoundContextRepositoryService', () => {
  let service: RoundContextRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoundContextRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
