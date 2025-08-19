import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class deliveryGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const adminId = localStorage.getItem('deliveryPersonId');
    if (adminId) {
      return true;
    } else {
      this.router.navigate(['/unauthorized']); // redirect if no ID
      return false;
    }
  }
}
