import { Component, OnInit, OnDestroy, inject, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ImageUtilityService } from '../../Services/image-utility.service';
import { Subscription } from 'rxjs';
import { UserProfileService } from '../../Services/user-profile.service';
import { UserProfile } from '../../Interfaces/auth';
import { Environment } from '../../Environment/environment';
import { UpdatePassword, UserProfilePhotoUploadDTO, UserProfileUpdateDTO } from '../../Interfaces/iuser-profile';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-customer-profile-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class CustomerProfileSettingsComponent implements OnInit, OnDestroy {
  private userProfileService = inject(UserProfileService);
  private fb = inject(FormBuilder);
  private imageUtilityService = inject(ImageUtilityService);
  private subscriptions: Subscription[] = [];

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  notificationForm!: FormGroup;
  imageForm!: FormGroup;

  profile: UserProfile | null = null;
  loading = true;
  saving = false;
  error = '';
  success = '';

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  profilePhotoUrl: string | null = 'assets/Images/default-profile.jpg';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  notificationSettings = {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderUpdates: true,
    maintenanceUpdates: true,
    deliveryUpdates: true,
    systemAlerts: true,
    marketingEmails: false
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
  private toastr: ToastrService
) {
    this.initializeForms();
  }

  ngOnInit(): void {
   this.passwordForm = this.fb.group(
  {
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  },
  { validators: this.passwordMatchValidator }
);

// Debugging form status (good idea 👍)
this.passwordForm.statusChanges.subscribe(status => {
  console.log('Form Status:', status, this.passwordForm.errors);
});
    this.loadProfile();
    this.loadProfilePhoto();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadProfilePhoto(): void {
      const userId =
        localStorage.getItem('customerId') || localStorage.getItem('userId');
      const storedPhotoName = localStorage.getItem('profilePhotoUrl') || 'photo';
  
      if (userId) {
        // Try to get profile image from API first
        this.subscriptions.push(
          this.imageUtilityService
            .getProfileImageUrlFromAPI(userId, storedPhotoName)
            .subscribe({
              next: (imageUrl) => {
                this.profilePhotoUrl = imageUrl;
              },
              error: (error) => {
                console.warn(
                  'Failed to load profile image from API, using static URL:',
                  error
                );
                // Fallback to static URL
                this.profilePhotoUrl =
                  this.imageUtilityService.getProfileImageUrl(
                    userId,
                    storedPhotoName
                  );
                if (storedPhotoName) {
                  // Ensure clean URL building
                  const apiBaseUrl = Environment.baseImageUrl.replace(/\/+$/, '');
                  const cleanedPath = storedPhotoName.replace(/^\/+/, '');
  
                  this.profilePhotoUrl = `${apiBaseUrl}/${cleanedPath}`;
                  console.log('Profile photo URL:', this.profilePhotoUrl);
                }
              },
            })
        );
  
      } else {
        // No user ID, use default profile image
        this.profilePhotoUrl = 'assets/Images/default-profile.jpg';
      }
    }

private initializeForms(): void {
  this.profileForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
    address: ['', [Validators.required, Validators.minLength(10)]],
    city: ['', [Validators.maxLength(50)]],
    country: ['', [Validators.maxLength(50)]]
  });

  this.notificationForm = this.fb.group({
    emailNotifications: [true],
    smsNotifications: [false],
    pushNotifications: [true],
    orderUpdates: [true],
    maintenanceUpdates: [true],
    deliveryUpdates: [true],
    systemAlerts: [true],
    marketingEmails: [false]
  });

  // New form for image upload
  this.imageForm = this.fb.group({
    profilePhoto: [null, Validators.required]
  });
}
isPasswordFormValid(): boolean {
  return this.passwordForm.valid;
}



  // ✅ Password match validator
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!newPassword || !confirmPassword) return null; // don’t block when empty

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }
  

  async loadProfile(): Promise<void> {
    this.loading = true;
    this.error = '';

    this.subscriptions.push(
      this.userProfileService.getUserProfile().subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.profile = res.data as UserProfile;
            this.profileForm.patchValue({
              fullName: this.profile.fullName || '',
              userName: this.profile.userName || '',
              email: this.profile.email || '',
              phoneNumber: this.profile.phoneNumber || '',
              address: this.profile.address || '',
              city: this.profile.city || '',
              country: this.profile.country || ''
            });
          } else {
            this.error = res.message || 'Failed to load profile';
          }
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'Error fetching profile';
          this.loading = false;
        }
      })
    );
  }

  onImageSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      this.error = 'Please select a valid image file';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.error = 'Image size should be less than 5MB';
      return;
    }
    this.selectedFile = file;
    this.imagePreview = URL.createObjectURL(file);
    this.imageForm.patchValue({ profilePhoto: file });
    this.error = '';
  }
}
uploadImageForm(): void {
  if (!this.selectedFile) return;

  this.saving = true;
  this.error = '';

  const dto = { profilePhoto: this.selectedFile } as UserProfilePhotoUploadDTO;

  this.subscriptions.push(
    this.userProfileService.uploadProfilePhoto(dto).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.success = 'Profile image updated successfully';
          this.profilePhotoUrl = res.data || 'assets/Images/default-profile.jpg';
          this.imageForm.reset();
          this.selectedFile = null;
          this.imagePreview = null;

          // Store the new URL if needed
          localStorage.setItem('profilePhotoUrl', this.profilePhotoUrl);
          if (res.success && isPlatformBrowser(this.platformId)) {
            window.location.reload();
          }
        } else {
          this.error = res.message || 'Failed to update image';
        }
        this.saving = false;
        setTimeout(() => (this.success = ''), 3000);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error uploading image';
        this.saving = false;
      }
    })
  );
}







  async uploadProfileImage(): Promise<void> {
    if (!this.selectedFile) return;

    this.saving = true;
    this.error = '';

    const dto = { profilePhoto: this.selectedFile };

    this.subscriptions.push(
      this.userProfileService.uploadProfilePhoto(dto).subscribe({
        next: (res) => {
          if (res.success) {
            this.success = 'Profile image uploaded successfully';
            this.profilePhotoUrl = res.data || 'assets/Images/default-profile.jpg';
          } else {
            this.error = res.message || 'Failed to upload image';
          }
          this.saving = false;
          setTimeout(() => this.success = '', 3000);
        },
        error: (err) => {
          console.error(err);
          this.error = 'Error uploading image';
          this.saving = false;
        }
      })
    );
  }

  async updateProfile(): Promise<void> {
  if (this.profileForm.invalid) return;

  this.saving = true;
  this.error = '';

  const dto: UserProfileUpdateDTO = {
    fullName: this.profileForm.value.fullName,
    email: this.profileForm.value.email,
    phoneNumber: this.profileForm.value.phoneNumber,
    address: this.profileForm.value.address,
    city: this.profileForm.value.city,
    country: this.profileForm.value.country,
    profilePhoto: this.selectedFile ?? null // null if no image selected
  };

  this.subscriptions.push(
    this.userProfileService.updateUserProfile(dto).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.success = 'Profile updated successfully';
          this.loadProfile();
        } else {
          this.error = res.message || 'Failed to update profile';
        }
        this.saving = false;
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error updating profile';
        this.saving = false;
      }
    })
  );
}


  onSubmit(): void {
  if (this.passwordForm.invalid) {
    this.toastr.error('Please fix the errors before submitting.');
    return;
  }

  this.saving = true;

  // Build FormData for [FromForm]
  const formData = new FormData();
  formData.append('CurrentPassword', this.passwordForm.get('currentPassword')?.value);
  formData.append('NewPassword', this.passwordForm.get('newPassword')?.value);
  formData.append('ConfirmNewPassword', this.passwordForm.get('confirmPassword')?.value);

  this.userProfileService.changePassword(formData).subscribe({
    next: () => {
      this.toastr.success('Password updated successfully!');
      this.passwordForm.reset(); // clear fields after success
      this.saving = false;
    },
    error: (err) => {
      console.error(err);
      // show backend error if available
      this.toastr.error(err?.error?.errors?.ConfirmNewPassword?.[0] || 'Failed to change password.');
      this.saving = false;
    }
  });
}



  async updateNotificationSettings(): Promise<void> {
    this.saving = true;
    this.error = '';

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.success = 'Notification settings updated successfully';
      setTimeout(() => this.success = '', 3000);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      this.error = 'Failed to update notification settings';
    } finally {
      this.saving = false;
    }
  }

  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) return `${fieldName} is required`;
      if (field.errors?.['email']) return 'Please enter a valid email';
      if (field.errors?.['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors?.['pattern']) return `Please enter a valid ${fieldName}`;
    }
    return '';
  }

  togglePasswordVisibility(field: 'currentPassword' | 'newPassword' | 'confirmPassword'): void {
    switch (field) {
      case 'currentPassword':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'newPassword':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirmPassword':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  formatPhoneNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 0) {
      value = '+' + value;
    }
    this.profileForm.patchValue({ phoneNumber: value });
  }
  

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/Images/default-profile.jpg';
    }
  }
}
