import { Component, OnInit } from '@angular/core';
import { WishListItemReadDTO } from '../../Interfaces/wishlist';
import { WishlistService } from '../../Services/wishlist.service';
import { CartService } from '../../Services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistItemComponent } from './components/wishlist-item/wishlist-item.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
  imports: [WishlistItemComponent, NgIf, NgFor]
})
export class WishlistComponent implements OnInit {
  wishList: WishListItemReadDTO[] = [];
  wishlistId: string = '';
  isLoading = true;

  constructor(
    private _wishList: WishlistService,
    private _cartService: CartService,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  private loadWishlist(): void {
    this._wishList.getLoggedWishList().subscribe({
      next: (res: any) => {
        console.log(res);
        this.wishList = res.data.items;
        this.wishlistId = res.data.id;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading wishlist:', err);
        this.isLoading = false;
      }
    });
  }

  onRemove(productId: string): void {
    this._wishList.removeWishedItem(productId).subscribe({
      next: () => {
        this._toastr.error('Item removed');
        this.loadWishlist();
        this._wishList.initializeWishlistState();
      },
      error: () => this._toastr.error('Remove failed')
    });
  }

  onAddToCart(productId: string): void {
    this._cartService.addItem(productId).subscribe({
      next: () => {
        this._toastr.success('Added to cart');
        this._cartService.initializeCartState();
      },
      error: () => this._toastr.error('Add to cart failed')
    });
  }

  moveAll(): void {
    const customerId = localStorage.getItem('customerId')!;
    this._wishList.moveAllToCart(this.wishlistId, customerId).subscribe({
      next: () => {
        this._toastr.success('Moved all items to cart');
        this.loadWishlist();
        this._cartService.initializeCartState();
      },
      error: () => this._toastr.error('Failed to move items')
    });
  }
}
