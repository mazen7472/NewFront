import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WishListItemReadDTO } from '../../../../Interfaces/wishlist';
import { CommonModule } from '@angular/common';
import { Environment } from '../../../../Environment/environment';

@Component({
  selector: 'app-wishlist-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist-item.component.html',
  styleUrls: ['./wishlist-item.component.css']
})
export class WishlistItemComponent {
  @Input() item!: WishListItemReadDTO;
  @Output() remove = new EventEmitter<string>();
  @Output() addToCart = new EventEmitter<string>();

  onRemoveClick(): void {
    this.remove.emit(this.item.productId);
  }

  onAddToCartClick(): void {
    this.addToCart.emit(this.item.productId);
  }

  /** Returns a fully-qualified image URL */
  getProductImageUrl(): string {
    if (!this.item.productImageUrl) {
      return '../../../../../assets/Images/about.jpg';
    }

    // If it already starts with http, use it directly
    if (this.item.productImageUrl.startsWith('http')) return this.item.productImageUrl;

    // Otherwise, prepend your backend base URL
    const baseUrl = Environment.baseImageUrl.replace(/\/+$/, '');
    const cleanPath = this.item.productImageUrl.replace(/^\/+/, '');
    return `${baseUrl}${cleanPath.startsWith('assets/') ? '/' : '/assets/'}${cleanPath}`;
  }

  /** Handles broken images */
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = '../../../../../assets/Images/about.jpg';
  }
}
