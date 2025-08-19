import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralProfileReadDTO } from '../Interfaces/GenProfileInterfaces/GeneralProfileReadDTO';
import { CustomerProfileDTO } from '../Interfaces/GenProfileInterfaces/CustomerProfileDTO';
import { TechCompanyProfileDTO } from '../Interfaces/GenProfileInterfaces/TechCompanyProfileDTO';
import { DeliveryPersonProfileDTO } from '../Interfaces/GenProfileInterfaces/DeliveryPersonProfileDTO';
import { Environment } from '../Environment/environment';
import { GeneralResponse } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {
  //use my envio API base URL

  private baseUrl = `${Environment.baseUrl}/profiles`; // adjust to your API base URL

  constructor(private http: HttpClient) {}

  // GET: all general profiles
  getAllProfiles(): Observable<GeneralResponse<GeneralProfileReadDTO[]>> {
    return this.http.get<GeneralResponse<GeneralProfileReadDTO[]>>(`${this.baseUrl}`);
  }

  // GET: single profile by Id
  getProfileById(id: string): Observable<GeneralResponse<GeneralProfileReadDTO>> {
    return this.http.get<GeneralResponse<GeneralProfileReadDTO>>(`${this.baseUrl}/${id}`);
  }

  // GET: customer profile
  getCustomerProfile(userId: string | undefined): Observable<GeneralResponse<CustomerProfileDTO>> {
    return this.http.get<GeneralResponse<CustomerProfileDTO>>(`${this.baseUrl}/customer/${userId}`);
  }

  // GET: tech company profile
  getTechCompanyProfile(userId: string | undefined): Observable<GeneralResponse<TechCompanyProfileDTO>> {
    return this.http.get<GeneralResponse<TechCompanyProfileDTO>>(`${this.baseUrl}/techcompany/${userId}`);
  }

  // GET: delivery person profile
  getDeliveryPersonProfile(userId: string | undefined): Observable<GeneralResponse<DeliveryPersonProfileDTO>> {
    return this.http.get<GeneralResponse<DeliveryPersonProfileDTO>>(`${this.baseUrl}/deliveryperson/${userId}`);
  }
}