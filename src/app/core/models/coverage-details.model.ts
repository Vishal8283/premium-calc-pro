
import { InsuranceType } from './insurance-type.enum';

// Fields common to every quote
export interface BaseCoverageDetails {
    insuranceType: InsuranceType;
    age: number;
}

// Vehicle-specific fields
export interface VehicleCoverageDetails extends BaseCoverageDetails {
    insuranceType: InsuranceType.VEHICLE;
    vehicleAge: number;         // years
    vehicleValue: number;       // IDV / current market value
    deductible: number;
    hasRoadsideAssistance: boolean;
    hasZeroDepreciation: boolean;
}

// Health-specific fields
export interface HealthCoverageDetails extends BaseCoverageDetails {
    insuranceType: InsuranceType.HEALTH;
    sumInsured: number;
    familySize: number;
    hasPreExistingConditions: boolean;
}

// Life-specific fields
export interface LifeCoverageDetails extends BaseCoverageDetails {
    insuranceType: InsuranceType.LIFE;
    sumAssured: number;
    termYears: number;
    isSmoker: boolean;
}

// A union type — TypeScript will narrow based on insuranceType
export type CoverageDetails =
    | VehicleCoverageDetails
    | HealthCoverageDetails
    | LifeCoverageDetails;
