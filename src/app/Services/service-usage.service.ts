import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceUsageCreateDTO, ServiceUsageResponse, ServiceUsageUpdateDTO } from '../Interfaces/iservice-usage';
import { Observable } from 'rxjs';
import { GeneralResponse } from './api.service';
import { Environment } from '../Environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceUsageService {
  private readonly baseUrl = `${Environment.baseUrl}/ServiceUsage`;

  constructor(private http: HttpClient) {}

  create(dto: ServiceUsageCreateDTO, serviceType: string): Observable<GeneralResponse<string>> {
    const params = new HttpParams().set('serviceType', serviceType);
    return this.http.post<GeneralResponse<string>>(this.baseUrl, dto, { params });
  }

  getById(id: string): Observable<GeneralResponse<ServiceUsageResponse>> {
    return this.http.get<GeneralResponse<ServiceUsageResponse>>(`${this.baseUrl}/${id}`);
  }

  getAll(): Observable<GeneralResponse<ServiceUsageResponse[]>> {
    return this.http.get<GeneralResponse<ServiceUsageResponse[]>>(this.baseUrl);
  }

  update(id: string, dto: ServiceUsageUpdateDTO, serviceType?: string): Observable<GeneralResponse<string>> {
    let params = new HttpParams();
    if (serviceType) {
      params = params.set('serviceType', serviceType);
    }
    return this.http.put<GeneralResponse<string>>(`${this.baseUrl}/${id}`, dto, { params });
  }

  delete(id: string): Observable<GeneralResponse<string>> {
    return this.http.delete<GeneralResponse<string>>(`${this.baseUrl}/${id}`);
  }
}
