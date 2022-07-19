import { TestBed } from '@angular/core/testing';

import { EstadisticosService } from './estadisticos.service';

describe('EstadisticosService', () => {
  let service: EstadisticosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadisticosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
