import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { techCompanyGuard } from './tech-company.guard';

describe('techCompanyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => techCompanyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
