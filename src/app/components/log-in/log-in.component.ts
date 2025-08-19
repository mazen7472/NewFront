import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginRequest } from '../../Interfaces/auth';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  private readonly fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService)

  success = false;
  errorMessage = '';
  isLoading = false;

  loginForm = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)
    ]]
  });

  loginSubmit(): void {
  if (this.loginForm.valid) {
    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    if (typeof email === 'string' && typeof password === 'string') {
      const payload: LoginRequest = {
        email: email,
        password: password,
        rememberMe: true
      };

      console.log('Sending login payload:', payload);

      this._authService.login(payload).subscribe({
        next: (res) => {
          console.log('Login response:', res);

          const token = res.data?.token;
          const customerId = res.data?.userId;
          const userName = res.data?.userName;
          const fullName = res.data?.fullName;
          const userRoles = res.data?.roleName ? res.data.roleName : [];

          if (token) {
            console.log(token);
            
            if (typeof window !== 'undefined' && window.localStorage) {
              localStorage.setItem('userToken', token);
              if(customerId) localStorage.setItem('userId', customerId);
              if(userName) localStorage.setItem('userName', userName);
              if(userRoles) localStorage.setItem('userRoles', JSON.stringify(userRoles));
              if(fullName) localStorage.setItem('fullName', fullName)
              
              // Store role-specific IDs from the response
              if (res.data?.customerId) {
                localStorage.setItem('customerId', res.data.customerId);
              }
              if (res.data?.adminId) {
                localStorage.setItem('adminId', res.data.adminId);
              }
              if (res.data?.techCompanyId) {
                localStorage.setItem('techCompanyId', res.data.techCompanyId);
              }
              if (res.data?.deliveryPersonId) {
                localStorage.setItem('deliveryPersonId', res.data.deliveryPersonId);
              }
              if (res.data?.cartId) {
                localStorage.setItem('cartId', res.data.cartId);
              }
              if (res.data?.wishListId) {
                localStorage.setItem('wishListId', res.data.wishListId);
              }
              if (res.data?.pcAssemblyId) {
                localStorage.setItem('pcAssemblyId', res.data.pcAssemblyId);
              }
              if (res.data?.profilePhotoUrl) {
                localStorage.setItem('profilePhotoUrl', res.data.profilePhotoUrl);
              }
              
              console.log('Stored IDs:', {
                userId: res.data?.userId,
                customerId: res.data?.customerId,
                adminId: res.data?.adminId,
                techCompanyId: res.data?.techCompanyId,
                deliveryPersonId: res.data?.deliveryPersonId,
                cartId: res.data?.cartId,
                wishListId: res.data?.wishListId,
                pcAssemblyId: res.data?.pcAssemblyId,
                profilePhotoUrl: res.data?.profilePhotoUrl
              });
              
              // Verify storage
              console.log('Verification - localStorage contents:');
              console.log('userId:', localStorage.getItem('userId'));
              console.log('customerId:', localStorage.getItem('customerId'));
              console.log('adminId:', localStorage.getItem('adminId'));
              console.log('techCompanyId:', localStorage.getItem('techCompanyId'));
              console.log('deliveryPersonId:', localStorage.getItem('deliveryPersonId'));
              console.log('userRole:', localStorage.getItem('userRole'));
            }

            this._authService.userData = { userName, customerId };
            this._authService.saveUserData();
            this._router.navigate(['/home']);
          } else {
            this.errorMessage = 'Invalid login response: token or userId missing.';
          }

          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Login failed', err);
          if (err.error?.errors) {
            const messages = Object.values(err.error.errors).flat();
            this.errorMessage = messages.join(' | ');
          } else {
            this.errorMessage = err.error?.message || 'Login failed';
          }
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Please enter a valid email and password.';
      this.isLoading = false;
    }
  } else {
    this.loginForm.markAllAsTouched();
  }
}

}
