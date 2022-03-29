import { TestBed } from '@angular/core/testing';

import { EquipoSistemasService } from './equipo-sistemas.service';

describe('EquipoSistemasService', () => {
  let service: EquipoSistemasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipoSistemasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
