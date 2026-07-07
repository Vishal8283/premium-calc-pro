import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverageDetailsStep } from './coverage-details-step';

describe('CoverageDetailsStep', () => {
  let component: CoverageDetailsStep;
  let fixture: ComponentFixture<CoverageDetailsStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoverageDetailsStep],
    }).compileComponents();

    fixture = TestBed.createComponent(CoverageDetailsStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
