import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticosComponent } from './estadisticos.component';

describe('EstadisticosComponent', () => {
  let component: EstadisticosComponent;
  let fixture: ComponentFixture<EstadisticosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadisticosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadisticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
