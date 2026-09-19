import { Component, signal } from '@angular/core';
import { InsuranceTypeStep } from '../insurance-type-step/insurance-type-step';
import { CoverageDetailsStep } from '../coverage-details-step/coverage-details-step';
import { InsuranceType } from '../../../core/models/insurance-type.enum';

@Component({
  selector: 'app-quote-wizard',
  standalone: true,
  imports: [InsuranceTypeStep, CoverageDetailsStep],
  templateUrl: './quote-wizard.html',
  styleUrl: './quote-wizard.scss'
})
export class QuoteWizard {
  selectedType = signal<InsuranceType | null>(null);

  onTypeSelected(type: InsuranceType): void {
    this.selectedType.set(type);
  }

  goBack(): void {
    this.selectedType.set(null);
  }

  onQuoteReady(result: unknown): void {
    console.log('Quote confirmed:', result);
  }
}