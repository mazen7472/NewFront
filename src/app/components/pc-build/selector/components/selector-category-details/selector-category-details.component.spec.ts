import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorCategoryDetailsComponent } from './selector-category-details.component';

describe('SelectorCategoryDetailsComponent', () => {
  let component: SelectorCategoryDetailsComponent;
  let fixture: ComponentFixture<SelectorCategoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorCategoryDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectorCategoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
