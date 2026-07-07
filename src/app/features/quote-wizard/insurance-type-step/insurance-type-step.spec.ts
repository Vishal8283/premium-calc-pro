import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceTypeStep } from './insurance-type-step';

describe('InsuranceTypeStep', () => {
  let component: InsuranceTypeStep;
  let fixture: ComponentFixture<InsuranceTypeStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceTypeStep],
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceTypeStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
