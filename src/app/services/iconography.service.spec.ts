import { TestBed } from '@angular/core/testing';

import { IconographyService } from './iconography.service';

describe('IconographyService', () => {
  let service: IconographyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IconographyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
