import { Component, OnInit, inject } from '@angular/core';
import { IProduct, IPagedProducts } from '../../../../Interfaces/iproduct';
import { ProductService } from '../../../../Services/product.service';
import { CartService } from '../../../../Services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { ProductItemComponent } from '../product-item/product-item.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductItemComponent, FormsModule, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  pagedProducts: IProduct[] = [];
  searchQuery: string = '';
  sortOrder: string = '';
  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = 0;
  loading = false;
  error = '';

  private _toastr = inject(ToastrService);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';
    
    const sortBy = 'price';
    const sortDesc = this.sortOrder === 'high';

    this.productService.getAllProducts(this.currentPage, this.pageSize, sortBy, sortDesc, this.searchQuery)
      .subscribe({
        next: (response) => {
          if (response.success) {
            const pagedData: IPagedProducts = response.data;
            this.pagedProducts = pagedData.items;
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
        console.error('Add to cart failed:', err);
        this._toastr.error('Could not add to cart');
      }
    });
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
