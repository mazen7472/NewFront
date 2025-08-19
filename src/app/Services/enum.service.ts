import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../Environment/environment';

export interface EnumValues {
  productPendingStatus: string[];
  serviceTypes: string[];
  productCategories: string[];
  orderStatus: string[];
}

export interface EnumResponse {
  success: boolean;
  message: string;
  data: EnumValues;
}

@Injectable({
  providedIn: 'root'
})
export class EnumService {
  private apiUrl = `${Environment.baseUrl}/Enums`;

  constructor(private http: HttpClient) {}

  // Get all enum values
  getAllEnumValues(): Observable<EnumResponse> {
    return this.http.get<EnumResponse>(`${this.apiUrl}/all`);
  }

  // Get product pending status enum values
  getProductPendingStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/product-pending-status`);
  }

  // Get service types enum values
  getServiceTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/service-types`);
  }

  // Get product categories enum values
  getProductCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/product-categories`);
  }

  // Get order status enum values
  getOrderStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/order-status`);
  }
} 