import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class buildGuardGuard implements CanActivate {
  private router = inject(Router);

  canActivate(): boolean {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      // Server-side rendering: block access
      return false;
    }

    const pcAssemblyId = localStorage.getItem('pcAssemblyId');

    if (pcAssemblyId) {
      return true;
    } else {
      this.router.navigate(['/pc-build']);
      return false;
    }
  }
}
