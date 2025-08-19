import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralResponse } from './cart.service';
import { DeliveryPerson } from './delivery-person.service';
import { DeliveryPersonUpdateDTO, Offer } from '../Interfaces/idelvery-person';
import { Environment } from '../Environment/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DelveryPersonService {

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

  // --- CRUD / Info ---
  getById(id: string): Observable<GeneralResponse<DeliveryPerson>> {
    return this.http.get<GeneralResponse<DeliveryPerson>>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getAll(): Observable<GeneralResponse<DeliveryPerson[]>> {
    return this.http.get<GeneralResponse<DeliveryPerson[]>>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getAvailable(): Observable<GeneralResponse<DeliveryPerson[]>> {
    return this.http.get<GeneralResponse<DeliveryPerson[]>>(`${this.apiUrl}/available`, { headers: this.getAuthHeaders() });
  }

  update(id: string, dto: DeliveryPersonUpdateDTO): Observable<GeneralResponse<DeliveryPerson>> {
    return this.http.put<GeneralResponse<DeliveryPerson>>(`${this.apiUrl}/${id}`, dto, { headers: this.getAuthHeaders() });
  }

  // --- Offers Management ---
  getAllOffers(driverId: string | null): Observable<GeneralResponse<Offer[]>> {
    return this.http.get<GeneralResponse<Offer[]>>(`${this.apiUrl}/${driverId}/offers/all`, { headers: this.getAuthHeaders() });
  }

  getPendingOffers(driverId: string): Observable<GeneralResponse<Offer[]>> {
    return this.http.get<GeneralResponse<Offer[]>>(`${this.apiUrl}/${driverId}/offers/pending`, { headers: this.getAuthHeaders() });
  }

  acceptOffer(driverId: string, offerId: string): Observable<GeneralResponse<Offer>> {
    return this.http.post<GeneralResponse<Offer>>(
      `${this.apiUrl}/${driverId}/offers/${offerId}/accept`, { headers: this.getAuthHeaders() }
    );
  }

  declineOffer(driverId: string, offerId: string): Observable<GeneralResponse<Offer>> {
    return this.http.post<GeneralResponse<Offer>>(
      `${this.apiUrl}/${driverId}/offers/${offerId}/decline`, { headers: this.getAuthHeaders() }
    );
  }

  cancelOffer(driverId: string, offerId: string): Observable<GeneralResponse<Offer>> {
    return this.http.post<GeneralResponse<Offer>>(
      `${this.apiUrl}/${driverId}/offers/${offerId}/cancel`, { headers: this.getAuthHeaders() }
    );
  }
}
