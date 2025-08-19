import { Component, OnInit } from '@angular/core';
import { ProductListComponent } from "./components/product-list/product-list.component";
import { IProduct } from '../../Interfaces/iproduct';
import { ProductService } from '../../Services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductListComponent, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: IProduct[] = [];      // all products from API
  pagedProducts: IProduct[] = []; // products to show on current page
  currentPage: number = 1;
  pageSize: number = 9;           // products per page
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  loading = false;
  error = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = '';
    
    this.productService.getAllProducts(this.currentPage, this.pageSize, 'name', false).subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data.items;
          this.totalPages = response.data.totalPages;
          this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
          this.updatePagedProducts();
        } else {
          this.error = response.message || 'Failed to load products';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
      }
    });
  }


  updatePagedProducts() {
    // Since we're getting paged data from API, we can use the products directly
    this.pagedProducts = this.products;
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadProducts(); // Reload products for the new page
  }
}
