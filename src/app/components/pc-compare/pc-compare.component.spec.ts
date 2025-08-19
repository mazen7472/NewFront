import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcCompareComponent } from './pc-compare.component';

describe('PcCompareComponent', () => {
  let component: PcCompareComponent;
  let fixture: ComponentFixture<PcCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PcCompareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PcCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
