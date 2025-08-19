import { Component, inject, Input, Output } from '@angular/core';
import { IProduct } from '../../../../../../Interfaces/iproduct';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../../../../Services/cart.service';
import { WishlistService } from '../../../../../../Services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { ImageUtilityService } from '../../../../../../Services/image-utility.service';
import { EventEmitter } from 'stream';
import { ImageUrlPipe } from '../../../../../../Pipes/image-url.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.css'
})
export class ProductItemComponent {
  @Input() productC!: IProduct;
  
    _router = inject(Router);
    _cartService = inject(CartService);
    _wishlistService = inject(WishlistService);
    _toastr = inject(ToastrService);
    _imageUtility = inject(ImageUtilityService);
  
    ngOnInit(): void {
      console.log('Product item initialized with:', this.productC);
    }

    goToProduct(id: string) {
      this._router.navigate(['/product-details', id]);
    }
  
    onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img.dataset['attempt'] === '1') {
      img.src = '/assets/Images/icon1.jpg'; // fallback placeholder you control
      return;
    }
    img.dataset['attempt'] = '1';
    img.src = this._imageUtility.getProductImageUrl(this.productC.id);
  }
  
  
    /**
     * Get the correct image URL for the product
     * @returns The formatted image URL
     */
    getProductImageUrl(): string {
      // If the product already has a valid imageUrl, use it
      if (this.productC.imageUrl && this._imageUtility.isValidImageUrl(this.productC.imageUrl)) {
        return this.productC.imageUrl;
      }
      
      // Otherwise, construct the URL using the new pattern
      return this._imageUtility.getProductImageUrl(this.productC.id);
    }
  
    onAddToWishlist(product: IProduct) {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) {
        this._toastr.error('Please login first');
        return;
      }
  
      console.log('💖 Adding to wishlist:', { productId: product.id, customerId });
  
      this._wishlistService.addItemToCustomerWishlist(customerId, product.id).subscribe({
        next: () => {
          this._toastr.success('Added to wishlist!');
          this._wishlistService.initializeWishlistState();
        },
        error: (err) => {
          console.error('❌ Wishlist API error:', err);
          this._toastr.error(`Item already in wishlist ${product.name}`);
        }
      });
    }
}
