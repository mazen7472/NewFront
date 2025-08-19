import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PCAssemblyService } from '../../Services/pcassembly.service';
import { PCAssemblyCreateDTO } from '../../Services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pc-build',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pc-build.component.html',
  styleUrl: './pc-build.component.css'
})
export class PcBuildComponent implements OnInit {
  buildForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  isBrowser = false;

  constructor(
    private fb: FormBuilder,
    private pcAssemblyService: PCAssemblyService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.buildForm = this.fb.group({
      customerId: [{ value: '', disabled: true }, Validators.required],
      name: [''],
      description: [''],
      budget: [''],
      serviceUsageId: ['']
    });
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const storedCustomerId = localStorage.getItem('customerId');
      const storedBuildId = localStorage.getItem('pcBuildId');
      const storedPCAssemblyService = localStorage.getItem('PCAssemblyService');

      if (storedCustomerId && storedPCAssemblyService) {
        this.buildForm.patchValue({ customerId: storedCustomerId });
        this.buildForm.patchValue({ serviceUsageId: JSON.parse(storedPCAssemblyService)[0]?.id });
      }

      if (storedBuildId) {
        this.router.navigate(['/selector']);
      }
    }
  }

  onSubmit(): void {
    if (this.buildForm.invalid) return;

    const dto: PCAssemblyCreateDTO = {
      ...this.buildForm.getRawValue() // includes disabled fields like customerId
    };

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.pcAssemblyService.create(dto).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success) {
          this.successMessage = `Build created! ID: ${res.data}`;
          this.buildForm.reset();

          if (this.isBrowser) {
            localStorage.setItem('pcAssemblyId', res.data); // ✅ save new build ID
            const storedCustomerId = localStorage.getItem('customerId');
            if (storedCustomerId) {
              this.buildForm.patchValue({ customerId: storedCustomerId });
            }
          }

          this.router.navigate(['/selector']);
        } else {
          this.errorMessage = `Error: ${res.message}`;
        }
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Something went wrong while creating the build.';
      }
    });
  }
}
