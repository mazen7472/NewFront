import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { buildGuardGuard } from './build-guard.guard';

describe('buildGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => buildGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
