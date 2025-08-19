import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.css'
})
export class EditCustomerComponent {
  @Input() customer: any; // Supply via binding or route data

  form!: FormGroup;

  roles = [
    'Customer',
    'TechManager',
    'TechCompany',
    'SalesManager',
    'Admin',
    'StockControlManager'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.customer?.name || ''],
      email: [this.customer?.email || ''],
      phone: [this.customer?.phone || ''],
      role: [this.customer?.role || 'Customer']
    });
  }

  updateCustomer() {
    console.log('Updated customer:', this.form.value);
    // Hook this into API call or service layer
  }
}
