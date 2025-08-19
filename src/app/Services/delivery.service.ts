import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../Environment/environment';
import { DeliveryClusterTracking, DeliveryCreateDTO } from '../Interfaces/idelivery';
import { GeneralResponse } from './cart.service';
import { isPlatformBrowser } from '@angular/common';

export interface Delivery {
  id: string;
  orderId: string;
  deliveryPersonId: string;
  status: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  trackingNumber: string;
  deliveryAddress: string;
  customerPhone: string;
  notes?: string;
}

export interface DeliveryResponse {
  success: boolean;
  message: string;
  data: Delivery[];
}

export interface SingleDeliveryResponse {
  success: boolean;
  message: string;
  data: Delivery;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = Environment.baseUrl + '/Delivery';
  private isBrowser: boolean;


  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: object) {
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
  
  getAllDeliveries(): Observable<DeliveryResponse> {
    return this.http.get<DeliveryResponse>(`${this.apiUrl}`, { headers: this.getAuthHeaders() });
  }
  
  getDeliveryById(id: string): Observable<SingleDeliveryResponse> {
    return this.http.get<SingleDeliveryResponse>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
  
  getDeliveriesByDeliveryPerson(deliveryPersonId: string): Observable<DeliveryResponse> {
    return this.http.get<DeliveryResponse>(`${this.apiUrl}/deliveryperson/${deliveryPersonId}`, { headers: this.getAuthHeaders() });
  }
  create(dto: DeliveryCreateDTO): Observable<GeneralResponse<Delivery>> {
    return this.http.post<GeneralResponse<Delivery>>(this.apiUrl, dto, { headers: this.getAuthHeaders() });
  }

  delete(id: string): Observable<GeneralResponse<string>> {
    return this.http.delete<GeneralResponse<string>>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // --- Driver / Cluster Assignments ---
  assignDriver(clusterId: string, driverId: string): Observable<GeneralResponse<any>> {
    return this.http.post<GeneralResponse<any>>(
      `${this.apiUrl}/assign-driver?clusterId=${clusterId}&driverId=${driverId}`, { headers: this.getAuthHeaders() }
    );
  }

  acceptDelivery(clusterId: string, driverId: string): Observable<GeneralResponse<any>> {
    return this.http.post<GeneralResponse<any>>(
      `${this.apiUrl}/accept?clusterId=${clusterId}&driverId=${driverId}`, { headers: this.getAuthHeaders() }
    );
  }

  declineDelivery(clusterId: string, driverId: string): Observable<GeneralResponse<any>> {
    return this.http.post<GeneralResponse<any>>(
      `${this.apiUrl}/decline?clusterId=${clusterId}&driverId=${driverId}`, { headers: this.getAuthHeaders() }
    );
  }

  cancelDelivery(deliveryId: string): Observable<GeneralResponse<any>> {
    return this.http.post<GeneralResponse<any>>(
      `${this.apiUrl}/cancel/${deliveryId}`, { headers: this.getAuthHeaders() }
    );
  }

  completeDelivery(deliveryId: string, driverId: string): Observable<GeneralResponse<any>> {
    return this.http.post<GeneralResponse<any>>(
      `${this.apiUrl}/complete?deliveryId=${deliveryId}&driverId=${driverId}`, { headers: this.getAuthHeaders() }
    );
  }

  // --- Tracking & Special Queries ---
  getTracking(deliveryId: string): Observable<GeneralResponse<DeliveryClusterTracking>> {
    return this.http.get<GeneralResponse<DeliveryClusterTracking>>(
      `${this.apiUrl}/tracking/${deliveryId}`, { headers: this.getAuthHeaders() }
    );
  }

  getExpiredOffers(): Observable<GeneralResponse<Delivery[]>> {
    return this.http.get<GeneralResponse<Delivery[]>>(`${this.apiUrl}/expired-offers`, { headers: this.getAuthHeaders() });
  }
} 