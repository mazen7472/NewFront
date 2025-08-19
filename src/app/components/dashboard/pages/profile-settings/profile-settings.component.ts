import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../Services/api.service';

interface AdminProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profileImageUrl?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginDate?: string;
}

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  notificationForm!: FormGroup;
  
  profile: AdminProfile | null = null;
  loading = true;
  saving = false;
  error = '';
  success = '';

  // File upload
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  // Password visibility
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  // Notification settings
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

  constructor() {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  private initializeForms(): void {
    // Profile form
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]]
    });

    // Password form
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Notification form
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
  }

  private passwordMatchValidator(form: FormGroup): { [key: string]: any } | null {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  async loadProfile(): Promise<void> {
    try {
      this.loading = true;
      this.error = '';

      // In a real implementation, you would get the admin profile from the API
      // For now, we'll use mock data
      this.profile = {
        id: 'admin-123',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@techperts.com',
        phoneNumber: '+1 (555) 123-4567',
        profileImageUrl: 'assets/Images/placeholder.png',
        role: 'Admin',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        lastLoginDate: '2024-01-15T10:30:00Z'
      };

      // Populate forms
      this.profileForm.patchValue({
        firstName: this.profile.firstName,
        lastName: this.profile.lastName,
        email: this.profile.email,
        phoneNumber: this.profile.phoneNumber
      });

      this.notificationForm.patchValue(this.notificationSettings);

    } catch (error) {
      console.error('Error loading profile:', error);
      this.error = 'Failed to load profile information';
    } finally {
      this.loading = false;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.error = 'Please select a valid image file';
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'Image size should be less than 5MB';
        return;
      }

      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadProfileImage(): Promise<void> {
    if (!this.selectedFile) return;

    try {
      this.saving = true;
      this.error = '';

      // In a real implementation, you would upload the image to the API
      // const formData = new FormData();
      // formData.append('image', this.selectedFile);
      // await this.apiService.uploadImage(formData).toPromise();

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.success = 'Profile image updated successfully';
      this.selectedFile = null;
      this.imagePreview = null;

      // Clear success message after 3 seconds
      setTimeout(() => {
        this.success = '';
      }, 3000);

    } catch (error) {
      console.error('Error uploading image:', error);
      this.error = 'Failed to upload profile image';
    } finally {
      this.saving = false;
    }
  }

  async updateProfile(): Promise<void> {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    try {
      this.saving = true;
      this.error = '';

      const profileData = this.profileForm.value;

      // In a real implementation, you would update the profile via API
      // await this.apiService.updateAdminProfile(profileData).toPromise();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.success = 'Profile updated successfully';
      
      // Update local profile data
      if (this.profile) {
        this.profile = { ...this.profile, ...profileData };
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        this.success = '';
      }, 3000);

    } catch (error) {
      console.error('Error updating profile:', error);
      this.error = 'Failed to update profile';
    } finally {
      this.saving = false;
    }
  }

  async changePassword(): Promise<void> {
    if (this.passwordForm.invalid) {
      this.markFormGroupTouched(this.passwordForm);
      return;
    }

    try {
      this.saving = true;
      this.error = '';

      const passwordData = this.passwordForm.value;

      // In a real implementation, you would change the password via API
      // await this.apiService.changePassword(passwordData).toPromise();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.success = 'Password changed successfully';
      this.passwordForm.reset();

      // Clear success message after 3 seconds
      setTimeout(() => {
        this.success = '';
      }, 3000);

    } catch (error) {
      console.error('Error changing password:', error);
      this.error = 'Failed to change password';
    } finally {
      this.saving = false;
    }
  }

  async updateNotificationSettings(): Promise<void> {
    try {
      this.saving = true;
      this.error = '';

      const notificationData = this.notificationForm.value;

      // In a real implementation, you would update notification settings via API
      // await this.apiService.updateNotificationSettings(notificationData).toPromise();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.success = 'Notification settings updated successfully';
      
      // Update local settings
      this.notificationSettings = { ...this.notificationSettings, ...notificationData };

      // Clear success message after 3 seconds
      setTimeout(() => {
        this.success = '';
      }, 3000);

    } catch (error) {
      console.error('Error updating notification settings:', error);
      this.error = 'Failed to update notification settings';
    } finally {
      this.saving = false;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['pattern']) {
        if (fieldName === 'phoneNumber') return 'Please enter a valid phone number';
        if (fieldName === 'newPassword') return 'Password must contain uppercase, lowercase, number, and special character';
      }
    }
    return '';
  }

  getPasswordError(): string {
    if (this.passwordForm.errors?.['passwordMismatch'] && this.passwordForm.get('confirmPassword')?.touched) {
      return 'Passwords do not match';
    }
    return '';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/Images/placeholder.png';
    }
  }
} 