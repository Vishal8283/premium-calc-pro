import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoverageDetailsStep } from './coverage-details-step';
import { InsuranceType } from '../../../core/models/insurance-type.enum';
import { PlanTier } from '../../../core/models/plan-tier.enum';

describe('CoverageDetailsStep', () => {
  let component: CoverageDetailsStep;
  let fixture: ComponentFixture<CoverageDetailsStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoverageDetailsStep]
    }).compileComponents();

    fixture = TestBed.createComponent(CoverageDetailsStep);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('insuranceType', InsuranceType.VEHICLE);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form by default (age = 30)', () => {
    expect(component.form.valid).toBe(true);
  });

  it('should mark the form invalid when age is below 18', () => {
    component.form.patchValue({ age: 15 });
    expect(component.form.valid).toBe(false);
    expect(component.form.controls.age.errors?.['min']).toBeTruthy();
  });

  it('should mark the form invalid when age is above 100', () => {
    component.form.patchValue({ age: 150 });
    expect(component.form.valid).toBe(false);
    expect(component.form.controls.age.errors?.['max']).toBeTruthy();
  });

  it('should disable the Confirm Quote button when the form is invalid', () => {
    component.form.patchValue({ age: 10 });
    fixture.detectChanges();

    const confirmBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.confirm-btn');
    expect(confirmBtn.disabled).toBe(true);
  });

  it('should enable the Confirm Quote button when the form is valid', () => {
    component.form.patchValue({ age: 30 });
    fixture.detectChanges();

    const confirmBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.confirm-btn');
    expect(confirmBtn.disabled).toBe(false);
  });

  it('should recalculate premium live when form values change', () => {
    const before = component.premium()?.totalPremium;

    component.form.patchValue({ vehicleValue: 1000000 });
    fixture.detectChanges();

    const after = component.premium()?.totalPremium;
    expect(after).not.toBe(before);
    expect(after).toBeGreaterThan(before!);
  });

  it('should emit quoteReady with correct plan and details when confirmed', () => {
    let emitted: any;
    component.quoteReady.subscribe((value) => {
      emitted = value;
    });

    component.onPlanChange(PlanTier.PREMIUM);
    component.confirmQuote();

    expect(emitted).toBeTruthy();
    expect(emitted.plan).toBe(PlanTier.PREMIUM);
    expect(emitted.details.insuranceType).toBe(InsuranceType.VEHICLE);
    expect(emitted.breakdown.totalPremium).toBeGreaterThan(0);
  });

  it('should calculate all three plan tiers for comparison', () => {
    const plans = component.allPlans();

    expect(plans[PlanTier.BASIC].totalPremium).toBeGreaterThan(0);
    expect(plans[PlanTier.STANDARD].totalPremium).toBeGreaterThan(plans[PlanTier.BASIC].totalPremium);
    expect(plans[PlanTier.PREMIUM].totalPremium).toBeGreaterThan(plans[PlanTier.STANDARD].totalPremium);
  });
});