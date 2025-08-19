import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { pcBuildGuard } from './pc-build.guard';

describe('pcBuildGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => pcBuildGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
