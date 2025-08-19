import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../Environment/environment';

export interface TechCompany {
  id: string;
  userName: string;
  email: string;
  city: string;
  country: string;
  mapLocation?: string | null;
  fullName: string;
  phoneNumber: string;
  address: string;
}

export interface TechCompanyUpdate {
  city: string;
  country: string;
  email: string;
  userName: string;
  phoneNumber: string;
  fullName: string;
  address: string;
  mapLocation?: string | null;
}

export interface TechCompanyResponse {
  success: boolean;
  message: string;
  data: TechCompany[];
}

export interface TechCompanyUpdateResponse {
  success: boolean;
  message: string;
  data: TechCompanyUpdate[];
}

// Response for single company
export interface SingleTechCompanyResponse {
  success: boolean;
  message: string;
  data: TechCompany;
}


@Injectable({
  providedIn: 'root'
})
export class TechCompanyService {
 private apiUrl = `${Environment.baseUrl}/TechCompany`;

  constructor(private http: HttpClient) {}

  getAllTechCompanies(): Observable<TechCompanyResponse> {
    return this.http.get<TechCompanyResponse>(`${this.apiUrl}`);
  }


  getTechCompanyById(id: string): Observable<SingleTechCompanyResponse> {
    return this.http.get<SingleTechCompanyResponse>(`${this.apiUrl}/${id}`);
  }


  updateTechCompany(id: string, company: TechCompanyUpdate): Observable<TechCompanyUpdateResponse> {
    return this.http.put<TechCompanyUpdateResponse>(`${this.apiUrl}/${id}`, company);
  }


  deleteTechCompany(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
