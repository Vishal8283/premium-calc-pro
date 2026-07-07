import { InsuranceType } from './insurance-type.enum';

export interface QuoteRequest {
    insuranceType: InsuranceType;
    age: number;
    // we'll add type-specific fields next step
}