import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Environment } from './../Environment/environment';
import { CheckoutRequestDTO } from '../Interfaces/iorder';
import { StripeService } from './stripe.service'; 


// ---------------- Interfaces ----------------
export interface CartResponse {
  success: boolean;
  message: string;
  data: CartData;
}

export interface CartData {
  id: string;
  customerId: string;
  createdAt: string;
  cartItems: CartItemDetail[];
  subTotal: number;
}

export interface CartItemDetail {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  stock: number;
  itemTotal: number;
  isCustomBuild: boolean;
  assemblyFee: number | null;
  productTotal: number;
  unitPrice: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  discountPrice?: number;
  UnitPrice?: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

export interface CartReadDTO {
  id: string;
  customerId: string;
  createdAt: string; // ISO string
  cartItems: CartItemReadDTO[];
  subTotal: number;
}

export interface CartItemReadDTO {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  stock: number;
  itemTotal: number;
  isCustomBuild: boolean;
  assemblyFee: number | null;
  productTotal: number;
  unitPrice: number;
}

export interface GeneralResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

// ---------------- Service ----------------
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _baseUrl = Environment.baseUrl;
  private isBrowser: boolean;

  private itemsCountSubject = new BehaviorSubject<number>(0);
  private totalPriceSubject = new BehaviorSubject<number>(0);
  private animateCartSubject = new BehaviorSubject<boolean>(false);

 constructor(
  private http: HttpClient,
  @Inject(PLATFORM_ID) private platformId: Object,
  private stripeService: StripeService  
) {
  this.isBrowser = isPlatformBrowser(this.platformId);
}

  // ---------------- Helpers ----------------
  private getCustomerId(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('customerId');
  }

  // ---------------- API Methods ----------------
  getCart(): Observable<GeneralResponse<CartReadDTO>> {
    if (!this.isBrowser) {
      return of({
        success: true,
        message: 'Running in non-browser environment',
        data: {
          id: '',
          customerId: '',
          createdAt: new Date().toISOString(),
          cartItems: [],
          subTotal: 0,
        },
      });
    }

    const userId = this.getCustomerId();
    if (!userId) {
      return throwError(() => new Error('Customer ID not found. Please log in.'));
    }

    return this.http.get<GeneralResponse<CartReadDTO>>(`${this._baseUrl}/Cart/${userId}`);
  }

  addItem(id: string): Observable<any> {
    if (!this.isBrowser) return throwError(() => new Error('Cannot add item on server.'));
    const userId = this.getCustomerId();
    if (!userId) return throwError(() => new Error('Customer ID not found. Please log in.'));

    return this.http.post(`${this._baseUrl}/Cart/${userId}/items`, {
      productId: id,
      quantity: 1,
    });
  }

  updateItem(item: CartItem): Observable<any> {
    if (!this.isBrowser) return throwError(() => new Error('Cannot update item on server.'));
    const userId = this.getCustomerId();
    if (!userId) return throwError(() => new Error('Customer ID not found. Please log in.'));

    return this.http.put(`${this._baseUrl}/Cart/${userId}/items`, {
      productId: item.productId,
      quantity: item.quantity,
    });
  }

  removeItem(productId: string): Observable<any> {
    if (!this.isBrowser) return throwError(() => new Error('Cannot remove item on server.'));
    const userId = this.getCustomerId();
    if (!userId) return throwError(() => new Error('Customer ID not found. Please log in.'));
    return this.http.delete(`${this._baseUrl}/Cart/${userId}/items/${productId}`);
  }

  increaseQuantity(item: CartItemReadDTO): void {
    this.updateItem({ productId: item.productId, quantity: item.quantity + 1 }).subscribe({
      next: () => this.initializeCartState(),
      error: (err) => console.error('Failed to increase quantity', err),
    });
  }

  decreaseQuantity(item: CartItemReadDTO): void {
    const newQuantity = item.quantity - 1;

    if (newQuantity < 1) {
      this.removeItem(item.productId).subscribe({
        next: () => this.initializeCartState(),
        error: (err) => console.error('Failed to remove item', err),
      });
      return;
    }

    this.updateItem({ productId: item.productId, quantity: newQuantity }).subscribe({
      next: () => this.initializeCartState(),
      error: (err) => console.error('Failed to decrease quantity', err),
    });
  }

  clearCart(): Observable<any> {
    if (!this.isBrowser) return throwError(() => new Error('Cannot clear cart on server.'));
    const userId = this.getCustomerId();
    if (!userId) return throwError(() => new Error('Customer ID not found. Please log in.'));
    return this.http.delete(`${this._baseUrl}/Cart/${userId}/clear`);
  }

  checkout(checkoutData?: Partial<CheckoutRequestDTO>): Observable<any> {
    if (!this.isBrowser) return throwError(() => new Error('Cannot checkout on server.'));
    const userId = this.getCustomerId();
    if (!userId) return throwError(() => new Error('Customer ID not found. Please log in.'));

    const checkoutRequest = {
      customerId: userId,
      orderDate: new Date().toISOString(),
      status: 'Pending',
      ...checkoutData,
    };

    return this.http.post(`${this._baseUrl}/Cart/${userId}/checkout`, checkoutRequest, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  calculateTotal(cartItems: CartItem[]): number {
    return cartItems.reduce(
      (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
      0
    );
  }

  // ---------------- State Management ----------------
  get itemCount$(): Observable<number> {
    return this.itemsCountSubject.asObservable();
  }

  get totalPrice$(): Observable<number> {
    return this.totalPriceSubject.asObservable();
  }

  get animateCart$(): Observable<boolean> {
    return this.animateCartSubject.asObservable();
  }

  updateCartState(cartItems: CartItemReadDTO[]) {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    this.itemsCountSubject.next(totalItems);
    this.totalPriceSubject.next(totalPrice);
    this.animateCartSubject.next(true);

    setTimeout(() => this.animateCartSubject.next(false), 500);
  }

  initializeCartState(): void {
    if (!this.isBrowser) return;
    const userId = this.getCustomerId();
    if (!userId) return;

    this.getCart().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.updateCartState(response.data.cartItems);
        } else {
          this.updateCartState([]);
        }
      },
      error: (err) => {
        console.error('Failed to initialize cart state:', err);
        this.updateCartState([]);
      },
    });
  }

createStripeSession(cartItems: CartItemReadDTO[]): Observable<{ clientSecret: string }> {
  if (!this.isBrowser) return throwError(() => new Error('Cannot create session on server.'));
  const userId = this.getCustomerId();
  const token = localStorage.getItem('jwtToken'); // or whatever key you use
  if (!userId) return throwError(() => new Error('Customer ID not found. Please log in.'));
  if (!token) return throwError(() => new Error('User not authenticated.'));

  const payload = {
    customerId: userId,
    items: cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price
    }))
  };

  return this.http.post<{ clientSecret: string }>(
    `${this._baseUrl}/Payments/cart-checkout`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );
}
}
