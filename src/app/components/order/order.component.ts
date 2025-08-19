import { Component } from '@angular/core';
import { OrderReadDTO } from '../../Interfaces/iorder';
import { OrderService } from '../../Services/order.service';
import { CommonModule, NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [NgClass, CommonModule, NgFor],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  orders: OrderReadDTO[] = [];
  isLoading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    const customerId = localStorage.getItem('customerId')!;
    this.orderService.getOrdersByCustomer(customerId).subscribe({
      next: (res) => {
        if (res.success) {
          this.orders = res.data;
        } else {
          console.warn(res.message);
        }
        this.isLoading = false;
      },
      error: () => (this.isLoading = false)
    });
  }
}
