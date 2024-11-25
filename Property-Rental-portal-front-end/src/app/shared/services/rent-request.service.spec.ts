import { TestBed } from '@angular/core/testing';

import { RentRequestService } from './rent-request.service';

describe('RentRequestService', () => {
  let service: RentRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RentRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
