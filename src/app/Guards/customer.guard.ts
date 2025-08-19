import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class customerGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const adminId = localStorage.getItem('customerId');
    if (adminId) {
      return true;
    } else {
      this.router.navigate(['/unauthorized']); // redirect if no ID
      return false;
    }
  }
}
