import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ScrollProgressComponent } from './components/scroll-progress/scroll-progress.component';
import { CartService } from './Services/cart.service';
import { ServiceUsageService } from './Services/service-usage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavBarComponent,
    FooterComponent,
    CommonModule,
    ScrollProgressComponent
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Teckperts-Solutions';
  isBrowser: boolean = false;
  _cartService = inject(CartService);
  constructor(private serviceusage: ServiceUsageService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this._cartService.initializeCartState();
    // Example usage of the service
    this.serviceusage.getAll().subscribe({
      next: (response) => {
        console.log('Service Usages:', response);
        if (this.isBrowser) {
          localStorage.setItem('PCAssemblyService', JSON.stringify(response.data.filter(usage => usage.serviceType === 'PCAssembly')));
          localStorage.setItem('ProductSaleService', JSON.stringify(response.data.filter(usage => usage.serviceType === 'ProductSale')));
          localStorage.setItem('DeliveryService', JSON.stringify(response.data.filter(usage => usage.serviceType === 'Delivery')));
          localStorage.setItem('MaintenanceService', JSON.stringify(response.data.filter(usage => usage.serviceType === 'Maintenance')));
        }
      },
      error: (error) => {
        console.error('Error fetching service usages:', error);
      }
    })
  }
}