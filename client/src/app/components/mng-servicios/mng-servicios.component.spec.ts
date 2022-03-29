import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MngServiciosComponent } from './mng-servicios.component';

describe('MngServiciosComponent', () => {
  let component: MngServiciosComponent;
  let fixture: ComponentFixture<MngServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MngServiciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MngServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
