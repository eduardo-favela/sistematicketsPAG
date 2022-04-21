import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadosEquiposComponent } from './empleados-equipos.component';

describe('EmpleadosEquiposComponent', () => {
  let component: EmpleadosEquiposComponent;
  let fixture: ComponentFixture<EmpleadosEquiposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpleadosEquiposComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadosEquiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
