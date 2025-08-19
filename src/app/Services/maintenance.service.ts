import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../Environment/environment';

export interface MaintenanceRequest {
  id: string;
  customerId: string;
  techCompanyId?: string;
  description: string;
  status: 'Pending' | 'Accepted' | 'InProgress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  requestDate: string;
  completedDate?: string;
  address: string;
  phone: string;
  serviceType: string;
}

export interface MaintenanceResponse {
  success: boolean;
  message: string;
  data: MaintenanceRequest[];
}

export interface SingleMaintenanceResponse {
  success: boolean;
  message: string;
  data: MaintenanceRequest;
}

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private apiUrl = `${Environment.baseUrl}/Maintenance`;

  constructor(private http: HttpClient) {}

  // Get all maintenance requests
  getAllMaintenanceRequests(): Observable<MaintenanceResponse> {
    return this.http.get<MaintenanceResponse>(this.apiUrl);
  }

  // Create new maintenance request
  createMaintenanceRequest(request: Partial<MaintenanceRequest>): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }

  // Get maintenance request by ID
  getMaintenanceRequestById(id: string): Observable<SingleMaintenanceResponse> {
    return this.http.get<SingleMaintenanceResponse>(`${this.apiUrl}/${id}`);
  }

  // Update maintenance request
  updateMaintenanceRequest(id: string, request: Partial<MaintenanceRequest>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, request);
  }

  // Delete maintenance request
  deleteMaintenanceRequest(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Get maintenance requests by tech company
  getMaintenanceByTechCompany(techCompanyId: string): Observable<MaintenanceResponse> {
    return this.http.get<MaintenanceResponse>(`${this.apiUrl}/tech-company/${techCompanyId}`);
  }

  // Get available maintenance requests
  getAvailableRequests(): Observable<MaintenanceResponse> {
    return this.http.get<MaintenanceResponse>(`${this.apiUrl}/available-requests`);
  }

  // Accept maintenance request
  acceptMaintenanceRequest(maintenanceId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${maintenanceId}/accept`, {});
  }

  // Complete maintenance request
  completeMaintenanceRequest(maintenanceId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${maintenanceId}/complete`, {});
  }

  // Update maintenance status
  updateMaintenanceStatus(maintenanceId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${maintenanceId}/status`, { status });
  }
} 