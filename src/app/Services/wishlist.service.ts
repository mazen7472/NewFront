import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { Environment } from '../Environment/environment';
import { GeneralResponse } from '../Interfaces/iorder';
import {
  WishListCreateDTO,
  WishListReadDTO,
  WishListItemCreateDTO,
  WishListItemReadDTO
} from '../Interfaces/wishlist';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private _baseUrl = `${Environment.baseUrl}/WishList`;
  private isBrowser: boolean;

  constructor(private _http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private itemsCountSubject = new BehaviorSubject<number>(0);
  get itemCount$(): Observable<number> {
    return this.itemsCountSubject.asObservable();
  }

  private getCustomerId(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('customerId');
  }

  createWishList(dto: WishListCreateDTO) {
    return this._http.post<GeneralResponse<string>>(this._baseUrl, dto);
  }

  getWishListById(id: string) {
    return this._http.get<GeneralResponse<WishListReadDTO>>(`${this._baseUrl}/${id}`);
  }

  getWishListByCustomerId(customerId: string) {
    return this._http.get<GeneralResponse<WishListReadDTO[]>>(`${this._baseUrl}/customer/${customerId}`);
  }

  getFirstWishlist(customerId: string): Observable<WishListReadDTO | null> {
    return this.getWishListByCustomerId(customerId).pipe(
      map(res => res.data?.[0] || null)
    );
  }

  addItemToWishList(wishListId: string, dto: WishListItemCreateDTO) {
    return this._http.post<GeneralResponse<string>>(`${this._baseUrl}/${wishListId}/items`, dto);
  }

  removeItemFromWishList(wishListId: string, itemId: string) {
    return this._http.delete<GeneralResponse<string>>(`${this._baseUrl}/${wishListId}/items/${itemId}`);
  }

  moveAllToCart(wishlistId: string, customerId: string) {
    return this._http.post<GeneralResponse<boolean>>(`${this._baseUrl}/${wishlistId}/move-to-cart?customerId=${customerId}`, {});
  }

  moveSelectedToCart(wishlistId: string, customerId: string, itemIds: string[]) {
    return this._http.post<GeneralResponse<boolean>>(`${this._baseUrl}/${wishlistId}/move-selected-to-cart?customerId=${customerId}`, itemIds);
  }

  getLoggedWishList() {
    const userId = this.getCustomerId();
    if (!userId) return throwError(() => new Error('Customer ID not found.'));
    return this.getFirstWishlist(userId).pipe(
      switchMap(wishlist => {
        if (!wishlist) return throwError(() => new Error('Wishlist not found.'));
        return of({ success: true, data: wishlist });
      })
    );
  }

  removeWishedItem(productId: string) {
    return this.getLoggedWishList().pipe(
      switchMap(res => {
        const wishlist = res.data;
        const item = wishlist.items.find(i => i.productId === productId);
        if (!item) throw new Error('Item not found');
        return this.removeItemFromWishList(wishlist.id, item.id);
      })
    );
  }

  addItemToCustomerWishlist(customerId: string, productId: string) {
    return this.getFirstWishlist(customerId).pipe(
      switchMap(wishlist => {
        const dto: WishListItemCreateDTO = { productId };
        if (wishlist) {
          return this.addItemToWishList(wishlist.id, dto);
        } else {
          return this.createWishList({
            customerId,
            items: [dto]
          });
        }
      })
    );
  }

  private updateWishlistState(items: WishListItemReadDTO[]) {
    this.itemsCountSubject.next(items.length);
  }

  initializeWishlistState(): void {
    const customerId = this.getCustomerId();
    if (!customerId) return;

    this.getFirstWishlist(customerId).subscribe({
      next: (wishlist) => this.updateWishlistState(wishlist?.items ?? []),
      error: (err) => console.error('Failed to init wishlist:', err)
    });
  }
}
