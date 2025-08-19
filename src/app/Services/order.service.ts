import { inject, Injectable } from '@angular/core';
import { GeneralResponse, OrderReadDTO } from '../Interfaces/iorder';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../Environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

   private _http = inject(HttpClient);
  private _baseUrl = `${Environment.baseUrl}/Orders`;

  /**
   * Get a single order by ID
   */
  getOrderById(id: string): Observable<GeneralResponse<OrderReadDTO>> {
    return this._http.get<GeneralResponse<OrderReadDTO>>(`${this._baseUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Failed to fetch order by ID', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get all orders (admin access or for listing)
   */
  getAllOrders(): Observable<GeneralResponse<OrderReadDTO[]>> {
    return this._http.get<GeneralResponse<OrderReadDTO[]>>(this._baseUrl).pipe(
      catchError((error) => {
        console.error('Failed to fetch all orders', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get orders by a specific customer ID
   */
  getOrdersByCustomer(customerId: string): Observable<GeneralResponse<OrderReadDTO[]>> {
    return this._http.get<GeneralResponse<OrderReadDTO[]>>(`${this._baseUrl}/by-customer/${customerId}`).pipe(
      catchError((error) => {
        console.error('Failed to fetch orders by customer ID', error);
        return throwError(() => error);
      })
    );
  }
}
