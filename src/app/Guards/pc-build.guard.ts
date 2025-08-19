import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PcBuildGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const pcAssemblyId = localStorage.getItem('pcAssemblyId');

    if (pcAssemblyId) {
      // Already have a build – go to selector
      return this.router.parseUrl('/selector');
    } else {
      // No build yet – stay on or go to /pc-build
      return true;
    }
  }
}
