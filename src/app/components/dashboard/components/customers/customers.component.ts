import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService, Customer, CustomerUpdate } from '../../../../Services/customer.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  loading = false;
  error = '';
  selectedCustomer: Customer | null = null;
  editingCustomer: Customer | null = null;

  editData: CustomerUpdate = {
    city: '',
    country: '',
    email: '',
    userName: '',
    phoneNumber: '',
    fullName: '',
    address: ''
  };

  @ViewChild('detailsModal') detailsModalRef!: ElementRef;
  private bootstrapModal: any;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.error = '';

    this.customerService.getAllCustomers().subscribe({
      next: (response) => {
        if (response.success) {
          this.customers = response.data;
        } else {
          this.error = response.message || 'Failed to load customers';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading customers:', err);
        this.error = 'Failed to load customers. Please try again later.';
        this.loading = false;

        // Fallback
        if (err.status === 0 || err.status === 404) {
          this.customers = [];
          this.error = '';
        }
      }
    });
  }

  showDetails(customer: Customer): void {
    this.selectedCustomer = customer;

    const bootstrap = (window as any).bootstrap;
    if (bootstrap && this.detailsModalRef?.nativeElement) {
      this.bootstrapModal = new bootstrap.Modal(this.detailsModalRef.nativeElement);
      this.bootstrapModal.show();
    }
  }

  closeDetails(): void {
    this.selectedCustomer = null;
    if (this.bootstrapModal) {
      this.bootstrapModal.hide();
    }
  }

  startEdit(customer: Customer): void {
    this.editingCustomer = customer;
    this.editData = {
      city: customer.city || '',
      country: customer.country || '',
      email: customer.email || '',
      userName: customer.userName || '',
      phoneNumber: customer.phoneNumber || '',
      fullName: customer.fullName || '',
      address: customer.address || ''
    };
  }

  cancelEdit(): void {
    this.editingCustomer = null;
  }

  submitEdit(): void {
    if (!this.editingCustomer) return;

    const id = this.editingCustomer.id;

    this.customerService.updateCustomer(id, this.editData).subscribe({
      next: (res) => {
        if (res.success) {
          const index = this.customers.findIndex(c => c.id === id);
          if (index !== -1) {
            this.customers[index] = {
              ...this.customers[index],
              ...this.editData,
              fullName: this.editData.fullName,
              phoneNumber: this.editData.phoneNumber
            };
          }
          this.cancelEdit();
        } else {
          alert('Failed to update: ' + res.message);
        }
      },
      error: (err) => {
        console.error('Update error', err);
        alert('Update failed. Check console for details.');
      }
    });
  }
}
