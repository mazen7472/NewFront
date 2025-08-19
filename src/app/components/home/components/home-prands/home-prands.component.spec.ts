import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePrandsComponent } from './home-prands.component';

describe('HomePrandsComponent', () => {
  let component: HomePrandsComponent;
  let fixture: ComponentFixture<HomePrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePrandsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomePrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
