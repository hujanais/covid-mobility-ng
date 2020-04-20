import { TestBed } from '@angular/core/testing';

import { GoogleMovementService } from './google-movement.service';

describe('GoogleMovementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoogleMovementService = TestBed.get(GoogleMovementService);
    expect(service).toBeTruthy();
  });
});
