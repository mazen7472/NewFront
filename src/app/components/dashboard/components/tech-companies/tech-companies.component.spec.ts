import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechCompaniesComponent } from './tech-companies.component';

describe('TechCompaniesComponent', () => {
  let component: TechCompaniesComponent;
  let fixture: ComponentFixture<TechCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechCompaniesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
