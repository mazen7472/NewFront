import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../Environment/environment';
import { isPlatformBrowser } from '@angular/common';

export type DeliveryPersonStatus = 'Pending' | 'Accepted' | 'Rejected';

export interface DeliveryPerson {
  city: string;
  accountStatus: DeliveryPersonStatus;
  country: string;
  id: string;
  isAvailable: boolean;
  phoneNumber: string;
  roleId: string;
  roleName: string;
  userFullName: string;
  userId: string;
  userName: string;
  vehicleNumber: string;
  vehicleType: string;
  vehicleImage: string;
}

export interface DeliveryPersonResponse {
  success: boolean;
  message: string;
  data: DeliveryPerson[];
}

export interface SingleDeliveryPersonResponse {
  success: boolean;
  message: string;
  data: DeliveryPerson;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryPersonService {
  private apiUrl = `${Environment.baseUrl}/DeliveryPerson`;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private getAuthHeaders(): HttpHeaders {
    let token = '';
    if (this.isBrowser) {
      token = localStorage.getItem('userToken') || '';
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Create new delivery person
  createDeliveryPerson(deliveryPerson: Partial<DeliveryPerson>): Observable<any> {
    return this.http.post(this.apiUrl, deliveryPerson, { headers: this.getAuthHeaders() });
  }

  // Get all delivery persons
  getAllDeliveryPersons(): Observable<DeliveryPersonResponse> {
    return this.http.get<DeliveryPersonResponse>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Get delivery person by ID
  getDeliveryPersonById(id: string): Observable<SingleDeliveryPersonResponse> {
    return this.http.get<SingleDeliveryPersonResponse>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Update delivery person
  updateDeliveryPerson(id: string, deliveryPerson: Partial<DeliveryPerson>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, deliveryPerson, { headers: this.getAuthHeaders() });
  }

  // Delete delivery person
  deleteDeliveryPerson(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Get available delivery persons
  getAvailableDeliveryPersons(): Observable<DeliveryPersonResponse> {
    return this.http.get<DeliveryPersonResponse>(`${this.apiUrl}/available`, { headers: this.getAuthHeaders() });
  }
}
