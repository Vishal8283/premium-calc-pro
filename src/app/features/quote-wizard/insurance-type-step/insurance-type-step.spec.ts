import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsuranceTypeStep } from './insurance-type-step';
import { InsuranceType } from '../../../core/models/insurance-type.enum';

describe('InsuranceTypeStep', () => {
  let component: InsuranceTypeStep;
  let fixture: ComponentFixture<InsuranceTypeStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceTypeStep]
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceTypeStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render three insurance type cards', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.option-card');
    expect(buttons.length).toBe(3);
  });

  it('should emit typeSelected with VEHICLE when the vehicle card is clicked', () => {
    let emittedValue: InsuranceType | undefined;
    component.typeSelected.subscribe((value: InsuranceType) => {
      emittedValue = value;
    });

    const buttons = fixture.nativeElement.querySelectorAll('.option-card');
    buttons[0].click(); // first card is Vehicle Insurance

    expect(emittedValue).toBe(InsuranceType.VEHICLE);
  });

  it('should emit typeSelected with LIFE when the life card is clicked', () => {
    let emittedValue: InsuranceType | undefined;
    component.typeSelected.subscribe((value: InsuranceType) => {
      emittedValue = value;
    });

    const buttons = fixture.nativeElement.querySelectorAll('.option-card');
    buttons[2].click(); // third card is Life Insurance

    expect(emittedValue).toBe(InsuranceType.LIFE);
  });
});