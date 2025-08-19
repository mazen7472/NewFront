import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-new-customer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-new-customer.component.html',
  styleUrl: './add-new-customer.component.css'
})
export class AddNewCustomerComponent {
    roles = [
    'Customer',
    'TechManager',
    'TechCompany',
    'SalesManager',
    'Admin',
    'StockControlManager'
  ];

  customer = {
    name: '',
    email: '',
    phone: '',
    role: 'Customer'
  };

  submitted = false;

  submitForm() {
    this.submitted = true;
    console.log('Customer submitted:', this.customer);
    // Hook into backend API here when you're ready
  }
}
