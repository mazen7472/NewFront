// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);
  const _AuthService = inject(AuthService);

  const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

  if (isBrowser) {
    // Check if user is logged in using AuthService
    if (_AuthService.userData && (_AuthService.customerId || 
        localStorage.getItem('techCompanyId') || 
        localStorage.getItem('deliveryPersonId') || 
        localStorage.getItem('adminId'))) {
      return true;
    } else {
      return _Router.parseUrl('/login');
    }
  }

  // If not in browser (SSR), block access
  return _Router.parseUrl('/login');
};

