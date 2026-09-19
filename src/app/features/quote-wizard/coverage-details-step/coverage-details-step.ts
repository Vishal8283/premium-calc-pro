import { Component, input, output, OnInit, inject, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InsuranceType } from '../../../core/models/insurance-type.enum';
import { CoverageDetails } from '../../../core/models/coverage-details.model';
import { PlanTier } from '../../../core/models/plan-tier.enum';
import { PremiumCalculatorService } from '../../../core/services/premium-calculator';
import { PremiumBreakdown } from '../../../core/models/premium-breakdown.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-coverage-details-step',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './coverage-details-step.html',
  styleUrl: './coverage-details-step.scss'
})
export class CoverageDetailsStep implements OnInit {
  // Receives the chosen insurance type from the parent wizard
  insuranceType = input<InsuranceType>(InsuranceType.VEHICLE);

  // Lets the parent know the final breakdown once the user confirms
  quoteReady = output<{ details: CoverageDetails; plan: PlanTier; breakdown: PremiumBreakdown }>();

  private fb = inject(FormBuilder);
  private calculator = inject(PremiumCalculatorService);

  InsuranceType = InsuranceType; // expose enum to template

  form = this.fb.group({
    age: [30, [Validators.required, Validators.min(18), Validators.max(100)]],

    // Vehicle fields
    vehicleAge: [2],
    vehicleValue: [500000],
    deductible: [1000],
    hasRoadsideAssistance: [false],
    hasZeroDepreciation: [false],

    // Health fields
    sumInsured: [500000],
    familySize: [1],
    hasPreExistingConditions: [false],

    // Life fields
    sumAssured: [1000000],
    termYears: [20],
    isSmoker: [false]
  });

  selectedPlan: PlanTier = PlanTier.STANDARD;

  private formChanges = toSignal(
    this.form.valueChanges.pipe(startWith(this.form.value))
  );

  // Live premium for the currently selected plan (used in the summary box)
  premium = computed(() => {
    this.formChanges(); // establishes reactive dependency on form changes
    return this.calculateCurrent();
  });

  // Live premium for ALL three plans at once (used in the comparison table)
  allPlans = computed(() => {
    this.formChanges(); // re-run whenever form changes
    const details = this.buildDetails();
    return {
      [PlanTier.BASIC]: this.calculator.calculate(details, PlanTier.BASIC),
      [PlanTier.STANDARD]: this.calculator.calculate(details, PlanTier.STANDARD),
      [PlanTier.PREMIUM]: this.calculator.calculate(details, PlanTier.PREMIUM)
    };
  });

  ngOnInit(): void {
    // Nothing extra needed yet — form already has sensible defaults
  }

  private buildDetails(): CoverageDetails {
    const v = this.form.getRawValue();
    const base = { age: v.age ?? 30 };

    switch (this.insuranceType()) {
      case InsuranceType.VEHICLE:
        return {
          ...base,
          insuranceType: InsuranceType.VEHICLE,
          vehicleAge: v.vehicleAge ?? 0,
          vehicleValue: v.vehicleValue ?? 0,
          deductible: v.deductible ?? 0,
          hasRoadsideAssistance: v.hasRoadsideAssistance ?? false,
          hasZeroDepreciation: v.hasZeroDepreciation ?? false
        };
      case InsuranceType.HEALTH:
        return {
          ...base,
          insuranceType: InsuranceType.HEALTH,
          sumInsured: v.sumInsured ?? 0,
          familySize: v.familySize ?? 1,
          hasPreExistingConditions: v.hasPreExistingConditions ?? false
        };
      case InsuranceType.LIFE:
        return {
          ...base,
          insuranceType: InsuranceType.LIFE,
          sumAssured: v.sumAssured ?? 0,
          termYears: v.termYears ?? 1,
          isSmoker: v.isSmoker ?? false
        };
    }
  }

  private calculateCurrent(): PremiumBreakdown {
    return this.calculator.calculate(this.buildDetails(), this.selectedPlan);
  }

  onPlanChange(plan: PlanTier): void {
    this.selectedPlan = plan;
  }

  confirmQuote(): void {
    const breakdown = this.calculateCurrent();
    this.quoteReady.emit({
      details: this.buildDetails(),
      plan: this.selectedPlan,
      breakdown
    });
  }

  readonly PlanTier = PlanTier; // expose enum to template
}