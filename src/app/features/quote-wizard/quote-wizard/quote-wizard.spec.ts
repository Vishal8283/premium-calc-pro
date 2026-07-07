import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteWizard } from './quote-wizard';

describe('QuoteWizard', () => {
  let component: QuoteWizard;
  let fixture: ComponentFixture<QuoteWizard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteWizard],
    }).compileComponents();

    fixture = TestBed.createComponent(QuoteWizard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
