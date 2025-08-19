import { NgClass } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { RolesService } from '../../Services/roles.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { RegisterRequest } from '../../Interfaces/auth';

@Component({
  selector: 'app-regester',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _rolesService = inject(RolesService);

  success: boolean = false;
  errMassage: string = "";
  isLoading: boolean = false;
  availableRoles: any[] = [];
  loadingRoles: boolean = false;

  registerForm = this._FormBuilder.group({
    fullName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    userName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    email: [null, [Validators.required, Validators.email]],
    address: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)]],
    confirmPassword: [null, [Validators.required]],
    phoneNumber: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: [null, [Validators.maxLength(50)]],
    country: [null, [Validators.maxLength(50)]],
    profilePhoto: [null],
    selectedRole: [null, [Validators.required]]
  }, { validators: this.confirmPassword });

  registSub!: Subscription;

  ngOnInit(): void {
    this.loadRegistrationOptions();
  }

  loadRegistrationOptions(): void {
    this.loadingRoles = true;
    this._rolesService.getRegistrationOptions().subscribe({
      next: (response) => {
        if (response.success && response.data?.roles) {
          this.availableRoles = response.data.roles;
        } else {
          // Fallback to default roles if API response is empty
          this.availableRoles = [
            { id: 'Customer', name: 'Customer', description: 'Regular customer account for shopping and PC building' },
            { id: 'TechCompany', name: 'Tech Company', description: 'Technology company account for maintenance services' },
            { id: 'DeliveryPerson', name: 'Delivery Person', description: 'Delivery person account for order fulfillment' }
          ];
        }
        this.loadingRoles = false;
      },
      error: (err) => {
        console.error('Error loading registration options:', err);
        this.loadingRoles = false;
        // Fallback to default roles if API fails
        this.availableRoles = [
          { id: 'Customer', name: 'Customer', description: 'Regular customer account for shopping and PC building' },
          { id: 'TechCompany', name: 'Tech Company', description: 'Technology company account for maintenance services' },
          { id: 'DeliveryPerson', name: 'Delivery Person', description: 'Delivery person account for order fulfillment' },
          { id: 'Admin', name: 'Admin', description: 'Administrator account with full system access' }
        ];
      }
    });
  }

  registerSubmit(): void {
  if (this.registerForm.valid) {
    this.isLoading = true;
    this.errMassage = "";

    const registrationData: RegisterRequest = {
      fullName: this.registerForm.value.fullName!,
      userName: this.registerForm.value.userName!,
      email: this.registerForm.value.email!,
      address: this.registerForm.value.address!,
      password: this.registerForm.value.password!,
      confirmPassword: this.registerForm.value.confirmPassword!,
      phoneNumber: this.registerForm.value.phoneNumber!,
      city: this.registerForm.value.city || undefined,
      country: this.registerForm.value.country || undefined,
      profilePhoto: this.registerForm.value.profilePhoto || undefined
    };

    const selectedRole = this.registerForm.value.selectedRole!;

    this.registSub = this._authService.register(registrationData, selectedRole).subscribe({
      next: (res) => {
        console.log(res);

        if (res.success) {
          this.success = true;

          // Automatically login after successful registration
          const loginPayload = {
            email: registrationData.email,
            password: registrationData.password,
            rememberMe: true
          };

          this._authService.login(loginPayload).subscribe({
            next: (loginRes) => {
              const token = loginRes.data?.token;
              const customerId = loginRes.data?.userId;
              const userName = loginRes.data?.userName;
              const userRoles = loginRes.data?.userRoles;

              if (token) {
                localStorage.setItem('userToken', token);
                if (customerId) localStorage.setItem('userId', customerId);
                if (userName) localStorage.setItem('userName', userName);
                if (userRoles) localStorage.setItem('userRole', JSON.stringify(userRoles));

                if (loginRes.data?.customerId) {
                  localStorage.setItem('customerId', loginRes.data.customerId);
                }
                if (loginRes.data?.adminId) {
                  localStorage.setItem('adminId', loginRes.data.adminId);
                }
                if (loginRes.data?.techCompanyId) {
                  localStorage.setItem('techCompanyId', loginRes.data.techCompanyId);
                }
                if (loginRes.data?.deliveryPersonId) {
                  localStorage.setItem('deliveryPersonId', loginRes.data.deliveryPersonId);
                }
                if (loginRes.data?.cartId) {
                  localStorage.setItem('cartId', loginRes.data.cartId);
                }
                if (loginRes.data?.wishListId) {
                  localStorage.setItem('wishListId', loginRes.data.wishListId);
                }
                if (loginRes.data?.pcAssemblyId) {
                  localStorage.setItem('pcAssemblyId', loginRes.data.pcAssemblyId);
                }
                if (loginRes.data?.profilePhotoUrl) {
                  localStorage.setItem('profilePhotoUrl', loginRes.data.profilePhotoUrl);
                }

                this._authService.userData = { userName, customerId };
                this._authService.saveUserData();
                this._router.navigate(['/home']);
              } else {
                this.errMassage = 'Automatic login failed: Token missing.';
              }

              this.isLoading = false;
            },
            error: (loginErr: HttpErrorResponse) => {
              console.error('Auto-login failed:', loginErr);
              this.errMassage = loginErr.error?.message || 'Automatic login failed';
              this.isLoading = false;
            }
          });

        } else {
          this.errMassage = res.message || 'Registration failed';
          this.isLoading = false;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.errMassage = err.error?.message || 'Registration failed';
        console.log(err);
        this.isLoading = false;
      }
    });
  } else {
    this.registerForm.markAllAsTouched();
  }
}


  ngOnDestroy(): void {
    if (this.registSub) {
      this.registSub.unsubscribe();
    }
  }

  confirmPassword(g: AbstractControl) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  getSelectedRoleName(): string {
    const selectedRole = this.registerForm.value.selectedRole;
    const role = this.availableRoles.find(r => r.id === selectedRole);
    return role ? role.name : '';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errMassage = 'Please select a valid image file';
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errMassage = 'Image size should be less than 5MB';
        return;
      }

      this.registerForm.patchValue({
        profilePhoto: file
      });
    }
  }
}
