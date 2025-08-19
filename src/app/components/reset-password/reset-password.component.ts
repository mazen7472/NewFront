import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';

/** Cross-field validator: newPassword must equal confirmPassword */
function matchValidator(a: string, b: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const c1 = group.get(a);
    const c2 = group.get(b);
    if (!c1 || !c2) return null;

    const v1 = c1.value ?? '';
    const v2 = c2.value ?? '';

    // Don’t flag mismatch until both have values
    if (!v1 || !v2) return null;

    return v1 === v2 ? null : { mismatch: true };
  };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterLink],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  message: string | null = null;
  error: string | null = null;
  isLoading: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group(
      {
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            // must contain lowercase, uppercase, number
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      { validators: matchValidator('newPassword', 'confirmPassword') }
    );
  }

  ngOnInit(): void {
    let rawToken = this.route.snapshot.queryParamMap.get('token');

    if (rawToken) {
      // Clean up accidental duplicate tokens like ?token=AAA?token=AAA or &token=AAA&token=AAA
      if (rawToken.includes('?token=')) rawToken = rawToken.split('?token=').pop() || rawToken;
      if (rawToken.includes('&token=')) rawToken = rawToken.split('&token=').pop() || rawToken;
      this.token = decodeURIComponent(rawToken);
    }

    if (!this.token) {
      this.error = 'Invalid or missing token.';
      this.resetForm.disable();
    }
  }

  submit() {
    if (!this.token) return;

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched(); // surface errors
      return;
    }

    this.isLoading = true; // ✅ start loading
    this.message = null;
    this.error = null;

    const { newPassword, confirmPassword } = this.resetForm.value;

    const payload = {
      token: this.token,
      newPassword,
      confirmPassword
    };

    this.authService.resetPassword(payload).subscribe({
      next: (res) => {
        this.message = res.message || 'Password reset successfully!';
        this.error = null;
        this.isLoading = false; 
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to reset password';
        this.message = null;
        this.isLoading = false; 
      }
    });
  }
}