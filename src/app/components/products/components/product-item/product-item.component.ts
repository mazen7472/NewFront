import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { IProduct } from '../../../../Interfaces/iproduct';
import { WishlistService } from '../../../../Services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Environment } from '../../../../Environment/environment';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {
  @Input() productC!: IProduct;
  @Output() addToCart = new EventEmitter<string>();

  private _router = inject(Router);
  private _wishlistService = inject(WishlistService);
  private _toastr = inject(ToastrService);


  ngOnInit(): void {}

  onAddToCart() {
    this.addToCart.emit(this.productC.id);
  }

  goToProduct(id: string) {
    this._router.navigate(['/product-details', id]);
  }

  /**
   * Return the correct main image URL for this product
   */
  getMainImageUrl(): string {
    if (this.productC.imageUrl) {
      const backendBase = Environment.baseImageUrl.replace(/\/+$/, '');
      return this.productC.imageUrl.startsWith('http') 
        ? this.productC.imageUrl 
        : `${backendBase}/${this.productC.imageUrl.replace(/^\/+/, '')}`;
    }
    return '../../../../../assets/Images/about.jpg';
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = '../../../../../assets/Images/about.jpg';
  }

  onAddToWishlist(product: IProduct) {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      this._toastr.error('Please login first');
      return;
    }

    this._wishlistService.addItemToCustomerWishlist(customerId, product.id).subscribe({
      next: () => {
        this._toastr.success('Added to wishlist!');
        this._wishlistService.initializeWishlistState();
      },
      error: (err) => {
        console.error('❌ Wishlist error:', err);
        this._toastr.error(`Item already in wishlist ${product.name}`);
      }
    });
  }
}
