import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverypersonProfileDetailsComponent } from './deliveryperson-profile-details.component';

describe('DeliverypersonProfileDetailsComponent', () => {
  let component: DeliverypersonProfileDetailsComponent;
  let fixture: ComponentFixture<DeliverypersonProfileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliverypersonProfileDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeliverypersonProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
