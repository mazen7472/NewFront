import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class techCompanyGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const techCompanyId = localStorage.getItem('techCompanyId');
    if (techCompanyId) {
      return true;
    } else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}

