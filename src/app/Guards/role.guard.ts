import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { RolesService } from '../Services/roles.service';
import { map, catchError, of } from 'rxjs';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const rolesService = inject(RolesService);

    // Check if user is logged in
    if (!authService.userData || (!authService.customerId && 
        !localStorage.getItem('techCompanyId') && 
        !localStorage.getItem('deliveryPersonId') && 
        !localStorage.getItem('adminId'))) {
      router.navigate(['/login']);
      return false;
    }

    // Check user roles from localStorage
    const userRoles = localStorage.getItem('userRoles');
    
    if (userRoles) {
      try {
        const roles = JSON.parse(userRoles);
        const hasRequiredRole = allowedRoles.some(role => roles.includes(role));
        
        if (hasRequiredRole) {
          return true;
        }
      } catch (error) {
        console.error('Error parsing user roles:', error);
      }
    }

    // Fallback: Check based on stored IDs
    const customerId = localStorage.getItem('customerId');
    const techCompanyId = localStorage.getItem('techCompanyId');
    const deliveryPersonId = localStorage.getItem('deliveryPersonId');
    const adminId = localStorage.getItem('adminId');

    if (allowedRoles.includes('Customer') && customerId) {
      return true;
    }
    if (allowedRoles.includes('TechCompany') && techCompanyId) {
      return true;
    }
    if (allowedRoles.includes('DeliveryPerson') && deliveryPersonId) {
      return true;
    }
    if (allowedRoles.includes('Admin') && adminId) {
      return true;
    }

    // If no roles found or user doesn't have required role
    router.navigate(['/unauthorized']);
    return false;
  };
};

// // Specific role guards
// export const adminGuard: CanActivateFn = roleGuard(['Admin']);
// export const techCompanyGuard: CanActivateFn = roleGuard(['TechCompany']);
// export const customerGuard: CanActivateFn = roleGuard(['Customer']);
// export const deliveryPersonGuard: CanActivateFn = roleGuard(['DeliveryPerson']); 