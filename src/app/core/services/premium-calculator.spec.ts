import { TestBed } from '@angular/core/testing';
import { PremiumCalculatorService } from './premium-calculator';
import { InsuranceType } from '../models/insurance-type.enum';
import { PlanTier } from '../models/plan-tier.enum';

describe('PremiumCalculatorService', () => {
  let service: PremiumCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PremiumCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate a basic vehicle premium without surcharges', () => {
    const result = service.calculate({
      insuranceType: InsuranceType.VEHICLE,
      age: 30,
      vehicleAge: 2,
      vehicleValue: 500000,
      deductible: 0,
      hasRoadsideAssistance: false,
      hasZeroDepreciation: false
    }, PlanTier.BASIC);

    // 3% of 500000 = 15000, no surcharges, BASIC multiplier = 1.0
    expect(result.totalPremium).toBe(15000);
  });

  it('should apply young driver surcharge under age 25', () => {
    const result = service.calculate({
      insuranceType: InsuranceType.VEHICLE,
      age: 22,
      vehicleAge: 2,
      vehicleValue: 500000,
      deductible: 0,
      hasRoadsideAssistance: false,
      hasZeroDepreciation: false
    }, PlanTier.BASIC);

    expect(result.totalPremium).toBeGreaterThan(15000);
  });

  it('should apply plan tier multiplier correctly', () => {
    const basic = service.calculate({
      insuranceType: InsuranceType.HEALTH,
      age: 30,
      sumInsured: 500000,
      familySize: 1,
      hasPreExistingConditions: false
    }, PlanTier.BASIC);

    const premium = service.calculate({
      insuranceType: InsuranceType.HEALTH,
      age: 30,
      sumInsured: 500000,
      familySize: 1,
      hasPreExistingConditions: false
    }, PlanTier.PREMIUM);

    expect(premium.totalPremium).toBeGreaterThan(basic.totalPremium);
  });
});