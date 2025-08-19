import { Component } from '@angular/core';
import { OrderReadDTO } from '../../../../Interfaces/iorder';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { AdminService } from '../../../../Services/admin.service';

@Component({
  selector: 'app-dashboard-order',
  standalone: true,
  imports: [NgClass, CommonModule, NgFor],
  templateUrl: './dashboard-order.component.html',
  styleUrl: './dashboard-order.component.css'
})
export class DashboardOrderComponent {
  orders: any[] = [];
    isLoading = true;
  
    constructor(private _admin: AdminService) {}
  
    ngOnInit(): void {
      this._admin.getOrders().subscribe({
        next: (res) => {
          if (res.success) {
            console.log(res.data);
            
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
