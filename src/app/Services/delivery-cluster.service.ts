import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DeliveryClusterDTO, DeliveryClusterTrackingDTO } from '../Interfaces/idelivery-cluster';
import { GeneralResponse } from './cart.service';
import { Observable } from 'rxjs';
import { DeliveryClusterCreateDTO } from '../Interfaces/idelivery';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Environment } from '../Environment/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DeliveryClusterService {

  private apiUrl = `${Environment.baseUrl}/DeliveryCluster`;
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

  // --- CRUD ---
  getById(clusterId: string): Observable<GeneralResponse<DeliveryClusterDTO>> {
    return this.http.get<GeneralResponse<DeliveryClusterDTO>>(`${this.apiUrl}/${clusterId}`, { headers: this.getAuthHeaders() });
  }

  getByDeliveryId(deliveryId: string): Observable<GeneralResponse<DeliveryClusterDTO[]>> {
    return this.http.get<GeneralResponse<DeliveryClusterDTO[]>>(`${this.apiUrl}/delivery/${deliveryId}`, { headers: this.getAuthHeaders() });
  }

  create(deliveryId: string, dto: DeliveryClusterCreateDTO): Observable<GeneralResponse<DeliveryClusterDTO>> {
    return this.http.post<GeneralResponse<DeliveryClusterDTO>>(`${this.apiUrl}/${deliveryId}`, dto, { headers: this.getAuthHeaders() });
  }

  update(clusterId: string, dto: DeliveryClusterDTO): Observable<GeneralResponse<DeliveryClusterDTO>> {
    return this.http.put<GeneralResponse<DeliveryClusterDTO>>(`${this.apiUrl}/${clusterId}`, dto, { headers: this.getAuthHeaders() });
  }

  delete(clusterId: string): Observable<GeneralResponse<string>> {
    return this.http.delete<GeneralResponse<string>>(`${this.apiUrl}/${clusterId}`, { headers: this.getAuthHeaders() });
  }

  // --- Tracking ---
  getTracking(clusterId: string): Observable<GeneralResponse<DeliveryClusterTrackingDTO>> {
    return this.http.get<GeneralResponse<DeliveryClusterTrackingDTO>>(`${this.apiUrl}/${clusterId}/tracking`, { headers: this.getAuthHeaders() });
  }

  updateTracking(clusterId: string, dto: DeliveryClusterTrackingDTO): Observable<GeneralResponse<DeliveryClusterTrackingDTO>> {
    return this.http.patch<GeneralResponse<DeliveryClusterTrackingDTO>>(`${this.apiUrl}/${clusterId}/tracking`, dto, { headers: this.getAuthHeaders() });
  }

  // --- Driver ---
  assignDriver(clusterId: string, driverId: string): Observable<GeneralResponse<DeliveryClusterDTO>> {
    return this.http.post<GeneralResponse<DeliveryClusterDTO>>(`${this.apiUrl}/${clusterId}/assign-driver/${driverId}`, { headers: this.getAuthHeaders() });
  }

  // --- Special Queries ---
  getUnassignedClusters(): Observable<GeneralResponse<DeliveryClusterDTO[]>> {
    return this.http.get<GeneralResponse<DeliveryClusterDTO[]>>(`${this.apiUrl}/unassigned`, { headers: this.getAuthHeaders() });
  }
}
