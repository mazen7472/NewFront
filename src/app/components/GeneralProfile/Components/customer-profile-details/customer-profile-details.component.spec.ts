import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProfileDetailsComponent } from './customer-profile-details.component';

describe('CustomerProfileDetailsComponent', () => {
  let component: CustomerProfileDetailsComponent;
  let fixture: ComponentFixture<CustomerProfileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerProfileDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
