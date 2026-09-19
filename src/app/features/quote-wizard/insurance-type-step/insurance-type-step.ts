import { Component, output } from '@angular/core';
import { InsuranceType } from '../../../core/models/insurance-type.enum';

interface InsuranceOption {
  type: InsuranceType;
  label: string;
  icon: string;
  description: string;
  accentClass: string;
}

@Component({
  selector: 'app-insurance-type-step',
  standalone: true,
  imports: [],
  templateUrl: './insurance-type-step.html',
  styleUrl: './insurance-type-step.scss'
})
export class InsuranceTypeStep {
  // Emits the selected type up to the parent wizard component
  typeSelected = output<InsuranceType>();

  options: InsuranceOption[] = [
    {
      type: InsuranceType.VEHICLE,
      label: 'Vehicle Insurance',
      icon: '🚗',
      description: 'Cover your car, bike, or commercial vehicle',
      accentClass: 'accent-blue'
    },
    {
      type: InsuranceType.HEALTH,
      label: 'Health Insurance',
      icon: '🏥',
      description: 'Medical coverage for you and your family',
      accentClass: 'accent-teal'
    },
    {
      type: InsuranceType.LIFE,
      label: 'Life Insurance',
      icon: '🛡️',
      description: 'Financial protection for your loved ones',
      accentClass: 'accent-purple'
    }
  ];

  selectType(type: InsuranceType): void {
    this.typeSelected.emit(type);
  }
}