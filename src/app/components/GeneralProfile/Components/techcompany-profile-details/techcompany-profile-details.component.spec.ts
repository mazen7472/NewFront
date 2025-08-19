import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechcompanyProfileDetailsComponent } from './techcompany-profile-details.component';

describe('TechcompanyProfileDetailsComponent', () => {
  let component: TechcompanyProfileDetailsComponent;
  let fixture: ComponentFixture<TechcompanyProfileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechcompanyProfileDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechcompanyProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
