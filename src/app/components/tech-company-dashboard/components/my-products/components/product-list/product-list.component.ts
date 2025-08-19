import { Component, Inject, inject, Input, PLATFORM_ID } from '@angular/core';
import { IPagedProducts, IProduct } from '../../../../../../Interfaces/iproduct';
import { CartService } from '../../../../../../Services/cart.service';
import { ProductService } from '../../../../../../Services/product.service';
import { ToastrService } from 'ngx-toastr';
import { ProductItemComponent } from "../product-item/product-item.component";
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductItemComponent, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  @Input() pagedProducts: IProduct[] = [];
  techCompanyId: string = '';
  isBrowser: boolean;
  
      searchQuery: string = '';
      sortOrder: string = ''; // '', 'low', 'high'
    
      currentPage: number = 1;
      pageSize: number = 6;
      totalPages: number = 0;
      loading = false;
      error = '';
    
      _toastr = inject(ToastrService);
    
      constructor(
        private productService: ProductService,
        private cartService: CartService,
        @Inject(PLATFORM_ID) platformId: object
      ) {
        this.isBrowser = isPlatformBrowser(platformId);
      }
    
      ngOnInit(): void {
  if (this.isBrowser) {
    this.techCompanyId = localStorage.getItem('techCompanyId') || '';
  }
  console.log(this.techCompanyId);
  this.loadProducts();
}

    
      loadProducts(): void {
  this.loading = true;
  this.error = '';

  const sortBy = 'price';
  const sortDesc = this.sortOrder === 'high';

  this.productService
    .getAllProductsTechDashboard(this.currentPage, this.pageSize, sortBy, sortDesc, this.searchQuery)
    .subscribe({
      next: (response) => {
        if (response.success) {
          const pagedData: IPagedProducts = response.data;

          // ✅ Filter products here
          this.pagedProducts = pagedData.items.filter(
            p => p.techCompanyId === this.techCompanyId
          );

          this.totalPages = pagedData.totalPages;
        } else {
          this.error = response.message || 'Failed to load products';
          this.pagedProducts = [];
          this.totalPages = 0;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products. Please try again later.';
        this.pagedProducts = [];
        this.totalPages = 0;
        this.loading = false;
      }
    });
}

    
      filterProducts(): void {
        this.currentPage = 1;
        this.loadProducts();
      }
    
      sortProducts(): void {
        this.currentPage = 1;
        this.loadProducts();
      }
    
      changePage(page: number): void {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
        this.loadProducts();
      }
    
      get totalPagesArray(): number[] {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
      }
    
      handleAddToCart(productId: string): void {
        const customerId = localStorage.getItem('customerId');
        if (!customerId) {
          this._toastr.error('Please login first');
          return;
        }
    
        this.cartService.addItem(productId).subscribe({
          next: () => {
            this._toastr.success('Added to cart');
            this.cartService.initializeCartState();
          },
          error: (err) => {
            console.error('❌ Add to cart failed:', err);
            this._toastr.error('Could not add to cart');
          }
        });
      }
    
      trackByIndex(index: number): number {
        return index;
      }
}
