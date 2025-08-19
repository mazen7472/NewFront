import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../Environment/environment';

export interface Customer {
  address: string;
  cartId: string;
  city: string;
  country: string;
  deliveryId: string;
  email: string;
  fullName: string;
  id: string;
  maintenanceIds:any[];
  orderIds: any[];
  pcAssemblyIds: any[];
  phoneNumber: string;
  userName: string;
  wishListId: string;
}
export interface CustomerUpdate {
  city: string;
  country: string;
  email: string;
  userName: string;
  phoneNumber: string;
  fullName: string;
  address: string;
}

export interface CustomerResponseUpdate {
  success: boolean;
  message: string;
  data: CustomerUpdate[];
}
export interface CustomerResponse {
  success: boolean;
  message: string;
  data: Customer[];
}

export interface SingleCustomerResponse {
  success: boolean;
  message: string;
  data: Customer;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${Environment.baseUrl}/Customer`;

  constructor(private http: HttpClient) {}

  getAllCustomers(): Observable<CustomerResponse> {
    console.log('Fetching customers from:', `${this.apiUrl}/All`);
    return this.http.get<CustomerResponse>(`${this.apiUrl}/All`);
  }

  getCustomerById(id: string): Observable<SingleCustomerResponse> {
    return this.http.get<SingleCustomerResponse>(`${this.apiUrl}/${id}`);
  }

  getActiveCustomers(): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.apiUrl}/Active`);
  }

  searchCustomers(query: string): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.apiUrl}/Search?query=${encodeURIComponent(query)}`);
  }
  updateCustomer(id: string, customer: CustomerUpdate): Observable<CustomerResponseUpdate> {
    return this.http.put<CustomerResponseUpdate>(`${this.apiUrl}/update/${id}`, customer);
  }
} 