import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaintenanceService } from '../../Services/maintenance.service';
import { AuthService } from '../../Services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-maintenance-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './maintenance-create.component.html',
  styleUrls: ['./maintenance-create.component.css']
})
export class MaintenanceCreateComponent implements OnInit {
  maintenanceForm: FormGroup;
  loading = false;
  submitting = false;
  serviceTypes: string[] = [];
  priorities: string[] = ['Low', 'Medium', 'High', 'Critical'];

  constructor(
    private fb: FormBuilder,
    private maintenanceService: MaintenanceService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.maintenanceForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(10)]],
      serviceType: ['', Validators.required],
      priority: ['Medium', Validators.required],
      address: ['', [Validators.required, Validators.minLength(10)]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]]
    });
  }

  ngOnInit(): void {
    this.loadServiceTypes();
  }

  loadServiceTypes(): void {
    // Load service types from API or use defaults
    this.serviceTypes = [
      'Hardware Repair',
      'Software Installation',
      'System Maintenance',
      'Network Setup',
      'Data Recovery',
      'Virus Removal',
      'Hardware Upgrade',
      'Software Troubleshooting'
    ];
  }

  onSubmit(): void {
    if (this.maintenanceForm.valid) {
      this.submitting = true;
      
      const customerId = this.authService.customerId;
      if (!customerId) {
        this.toastr.error('User not authenticated');
        this.submitting = false;
        return;
      }

      const maintenanceData = {
        customerId: customerId,
        ...this.maintenanceForm.value
      };

      this.maintenanceService.createMaintenanceRequest(maintenanceData).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('Maintenance request created successfully');
            this.router.navigate(['/maintenance/history']);
          } else {
            this.toastr.error(response.message || 'Failed to create maintenance request');
          }
          this.submitting = false;
        },
        error: (err) => {
          console.error('Error creating maintenance request:', err);
          this.toastr.error('Failed to create maintenance request. Please try again.');
          this.submitting = false;
        }
      });
    } else {
      this.maintenanceForm.markAllAsTouched();
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.maintenanceForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid phone number';
      }
    }
    return '';
  }
} 