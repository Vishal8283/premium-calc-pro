import { Injectable } from '@angular/core';
import { CoverageDetails } from '../models/coverage-details.model';
import { InsuranceType } from '../models/insurance-type.enum';
import { PlanTier } from '../models/plan-tier.enum';
import { PremiumBreakdown, PremiumBreakdownLine } from '../models/premium-breakdown.model';

@Injectable({
    providedIn: 'root'
})
export class PremiumCalculatorService {

    // Multiplier per plan tier — config-driven, easy to extend later
    private readonly planMultipliers: Record<PlanTier, number> = {
        [PlanTier.BASIC]: 1.0,
        [PlanTier.STANDARD]: 1.25,
        [PlanTier.PREMIUM]: 1.6
    };

    calculate(details: CoverageDetails, plan: PlanTier): PremiumBreakdown {
        switch (details.insuranceType) {
            case InsuranceType.VEHICLE:
                return this.calculateVehicle(details, plan);
            case InsuranceType.HEALTH:
                return this.calculateHealth(details, plan);
            case InsuranceType.LIFE:
                return this.calculateLife(details, plan);
        }
    }

    // ---------- VEHICLE ----------
    private calculateVehicle(
        details: Extract<CoverageDetails, { insuranceType: InsuranceType.VEHICLE }>,
        plan: PlanTier
    ): PremiumBreakdown {
        const lines: PremiumBreakdownLine[] = [];

        // Base premium as a % of vehicle value
        let base = details.vehicleValue * 0.03;
        lines.push({ label: 'Base premium (3% of vehicle value)', amount: base });

        // Older vehicles cost more to insure
        if (details.vehicleAge > 5) {
            const agePenalty = base * 0.15;
            lines.push({ label: 'Vehicle age surcharge (>5 yrs)', amount: agePenalty });
            base += agePenalty;
        }

        // Younger drivers are higher risk
        if (details.age < 25) {
            const youngDriverSurcharge = base * 0.20;
            lines.push({ label: 'Young driver surcharge (<25 yrs)', amount: youngDriverSurcharge });
            base += youngDriverSurcharge;
        }

        // Higher deductible = lower premium
        const deductibleDiscount = details.deductible * 0.01;
        lines.push({ label: 'Deductible discount', amount: -deductibleDiscount });
        base -= deductibleDiscount;

        // Add-ons
        if (details.hasRoadsideAssistance) {
            lines.push({ label: 'Roadside assistance add-on', amount: 500 });
            base += 500;
        }
        if (details.hasZeroDepreciation) {
            const zeroDepCost = details.vehicleValue * 0.01;
            lines.push({ label: 'Zero depreciation cover', amount: zeroDepCost });
            base += zeroDepCost;
        }

        return this.applyPlan(base, lines, plan);
    }

    // ---------- HEALTH ----------
    private calculateHealth(
        details: Extract<CoverageDetails, { insuranceType: InsuranceType.HEALTH }>,
        plan: PlanTier
    ): PremiumBreakdown {
        const lines: PremiumBreakdownLine[] = [];

        let base = details.sumInsured * 0.02;
        lines.push({ label: 'Base premium (2% of sum insured)', amount: base });

        // Age-based risk loading
        if (details.age > 45) {
            const ageLoading = base * 0.30;
            lines.push({ label: 'Age risk loading (>45 yrs)', amount: ageLoading });
            base += ageLoading;
        }

        // Family floater adds per additional member
        if (details.familySize > 1) {
            const familyLoading = (details.familySize - 1) * (base * 0.10);
            lines.push({ label: `Family floater (+${details.familySize - 1} members)`, amount: familyLoading });
            base += familyLoading;
        }

        // Pre-existing conditions
        if (details.hasPreExistingConditions) {
            const conditionLoading = base * 0.25;
            lines.push({ label: 'Pre-existing conditions loading', amount: conditionLoading });
            base += conditionLoading;
        }

        return this.applyPlan(base, lines, plan);
    }

    // ---------- LIFE ----------
    private calculateLife(
        details: Extract<CoverageDetails, { insuranceType: InsuranceType.LIFE }>,
        plan: PlanTier
    ): PremiumBreakdown {
        const lines: PremiumBreakdownLine[] = [];

        let base = (details.sumAssured / details.termYears) * 0.015;
        lines.push({ label: 'Base premium (sum assured / term × 1.5%)', amount: base });

        // Older applicants = higher risk
        if (details.age > 40) {
            const ageLoading = base * 0.35;
            lines.push({ label: 'Age risk loading (>40 yrs)', amount: ageLoading });
            base += ageLoading;
        }

        // Smokers pay more
        if (details.isSmoker) {
            const smokerLoading = base * 0.50;
            lines.push({ label: 'Smoker loading', amount: smokerLoading });
            base += smokerLoading;
        }

        return this.applyPlan(base, lines, plan);
    }

    // ---------- Shared: apply plan tier multiplier ----------
    private applyPlan(
        baseAfterFactors: number,
        lines: PremiumBreakdownLine[],
        plan: PlanTier
    ): PremiumBreakdown {
        const multiplier = this.planMultipliers[plan];
        const total = Math.round(baseAfterFactors * multiplier);

        return {
            basePremium: Math.round(baseAfterFactors),
            lines: lines.map(l => ({ ...l, amount: Math.round(l.amount) })),
            planMultiplier: multiplier,
            totalPremium: total
        };
    }
}