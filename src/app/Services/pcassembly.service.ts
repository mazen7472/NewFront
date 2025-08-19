import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { Observable, catchError, of, map } from 'rxjs';
import { Environment } from '../Environment/environment';
import {
  PCAssemblyCreateDTO,
  PCAssemblyReadDTO,
  PCAssemblyUpdateDTO,
  PCAssemblyItemCreateDTO,
  AddComponentToBuildDTO,
  PCBuildStatusDTO,
  PCBuildComponentDTO,
  PCBuildTotalDTO,
  PCBuildTableDTO,
  CompatibleComponentDTO,
  CompatibleProductDTO,
  PCComponentCategory,
  GeneralResponse,
  PcAssemblyDetails
} from '../Interfaces/ipc-assembly';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { IProduct, ProductCategory } from '../Interfaces/iproduct';

@Injectable({
  providedIn: 'root'
})
export class PCAssemblyService {
  private _httpClient = inject(HttpClient);
  private _baseUrl = Environment.baseUrl;

  constructor(
  @Inject(PLATFORM_ID) private platformId: Object
) {}


  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const token = localStorage.getItem('userToken');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  create(dto: PCAssemblyCreateDTO): Observable<GeneralResponse<string>> {
  return this._httpClient
    .post<GeneralResponse<PCAssemblyReadDTO>>(`${this._baseUrl}/PCAssembly`, dto)
    .pipe(
      map((response): GeneralResponse<string> => ({
        success: response.success,
        message: response.message,
        data: response.data?.id || ''
      }))
    );
}

getPcAssemblyDetails(buildId: string): Observable<GeneralResponse<PcAssemblyDetails>> {
  return this._httpClient.get<GeneralResponse<PcAssemblyDetails>>(`${this._baseUrl}/PCAssembly/build/${buildId}/table`);
}



  getById(id: string): Observable<GeneralResponse<PCAssemblyReadDTO>> {
    return this._httpClient.get<GeneralResponse<PCAssemblyReadDTO>>(
      `${this._baseUrl}/PCAssembly/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error getting PC assembly by ID:', error);
        return of({ success: false, message: 'Failed to get PC assembly', data: {} as PCAssemblyReadDTO });
      })
    );
  }

  getAll(): Observable<GeneralResponse<PCAssemblyReadDTO[]>> {
    return this._httpClient.get<GeneralResponse<PCAssemblyReadDTO[]>>(
      `${this._baseUrl}/PCAssembly`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error getting all PC assemblies:', error);
        return of({ success: false, message: 'Failed to get PC assemblies', data: [] });
      })
    );
  }

  getByCustomerId(customerId: string): Observable<GeneralResponse<PCAssemblyReadDTO[]>> {
    return this._httpClient.get<GeneralResponse<PCAssemblyReadDTO[]>>(
      `${this._baseUrl}/PCAssembly/customer/${customerId}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error getting PC assemblies by customer ID:', error);
        return of({ success: false, message: 'Failed to get customer PC assemblies', data: [] });
      })
    );
  }

  update(id: string, dto: PCAssemblyUpdateDTO): Observable<GeneralResponse<string>> {
    return this._httpClient.put<GeneralResponse<string>>(
      `${this._baseUrl}/PCAssembly/${id}`,
      dto,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error updating PC assembly:', error);
        return of({ success: false, message: 'Failed to update PC assembly', data: '' });
      })
    );
  }

  getBuildComponents(assemblyId: string): Observable<GeneralResponse<PCBuildComponentDTO[]>> {
    return this._httpClient.get<GeneralResponse<PCBuildComponentDTO[]>>(
      `${this._baseUrl}/PCAssembly/build/${assemblyId}/components`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error getting build components:', error);
        return of({ success: false, message: 'Failed to get build components', data: [] });
      })
    );
  }

  getComponentsByCategory(
    category: ProductCategory,
    pageNumber = 1,
    pageSize = 20,
    search?: string,
    sortBy = 'name',
    sortDesc = false
  ): Observable<GeneralResponse<PCBuildComponentDTO[]>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortDesc', sortDesc.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this._httpClient.get<GeneralResponse<PCBuildComponentDTO[]>>(
      `${this._baseUrl}/PCAssembly/build/components/${category}`,
      { params, headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error getting components by category:', error);
        return of({ success: false, message: 'Failed to get components by category', data: [] });
      })
    );
  }

  getPCComponentCategories(): Observable<GeneralResponse<PCComponentCategory[]>> {
    return this._httpClient.get<GeneralResponse<PCComponentCategory[]>>(
      `${this._baseUrl}/PCAssembly/build/categories`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error getting PC component categories:', error);
        return of({ success: false, message: 'Failed to get PC component categories', data: [] });
      })
    );
  }

  addComponentToBuild(assemblyId: string, dto: AddComponentToBuildDTO): Observable<GeneralResponse<string>> {
    const formData = new FormData();
    formData.append('productId', dto.productId);
    formData.append('category', dto.category.toString());

    return this._httpClient.post<GeneralResponse<string>>(
      `${this._baseUrl}/PCAssembly/build/${assemblyId}/add-component`,
      formData
    ).pipe(
      catchError(error => {
        console.error('Error adding component to build:', error);
        return of({ success: false, message: 'Failed to add component to build', data: '' });
      })
    );
  }

  removeComponentFromBuild(itemId: string): Observable<GeneralResponse<string>> {
  if (!isPlatformBrowser(this.platformId)) {
    return of({ success: false, message: 'Not running in browser', data: '' });
  }

  const assemblyId = localStorage.getItem('pcAssemblyId');
  if (!assemblyId) {
    return of({ success: false, message: 'Assembly ID not found', data: '' });
  }

  return this._httpClient.delete<GeneralResponse<string>>(
    `${this._baseUrl}/PCAssembly/build/${assemblyId}/remove-component/${itemId}`,
    { headers: this.getHeaders() }
  )
}




  getPCBuildStatus(assemblyId: string): Observable<GeneralResponse<PCBuildStatusDTO>> {
    return this._httpClient.get<GeneralResponse<PCBuildStatusDTO>>(
      `${this._baseUrl}/PCAssembly/build/${assemblyId}/status`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error getting PC build status:', error);
        return of({ success: false, message: 'Failed to get PC build status', data: {} as PCBuildStatusDTO });
      })
    );
  }

  getPCBuildTotal(assemblyId: string): Observable<GeneralResponse<PCBuildTotalDTO>> {
    return this._httpClient.get<GeneralResponse<PCBuildTotalDTO>>(
      `${this._baseUrl}/PCAssembly/build/${assemblyId}/total`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error getting PC build total:', error);
        return of({ success: false, message: 'Failed to get PC build total', data: {} as PCBuildTotalDTO });
      })
    );
  }

  getPCBuildTable(assemblyId: string): Observable<GeneralResponse<PCBuildTableDTO>> {
    return this._httpClient.get<GeneralResponse<PCBuildTableDTO>>(
      `${this._baseUrl}/PCAssembly/build/${assemblyId}/table`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error getting PC build table:', error);
        return of({ success: false, message: 'Failed to get PC build table', data: {} as PCBuildTableDTO });
      })
    );
  }

  getCompatibleComponents(assemblyId: string, categoryName: string): Observable<GeneralResponse<IProduct[]>> {
  return this._httpClient.get<GeneralResponse<IProduct[]>>(
    `${this._baseUrl}/PCAssembly/${assemblyId}/compatible-products/${categoryName}`,
    { headers: this.getHeaders() }
  ).pipe(
    catchError(error => {
      console.error('Error getting compatible components:', error);
      return of({
        success: false,
        message: 'Failed to get compatible components',
        data: []
      });
    })
  );
}


  addBuildToCart(assemblyId: string): Observable<GeneralResponse<string>> {
    const params = new HttpParams()

    return this._httpClient.post<GeneralResponse<string>>(
      `${this._baseUrl}/PCAssembly/${assemblyId}/move-to-cart`,
      null,
      { params, headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error adding build to cart:', error);
        return of({ success: false, message: 'Failed to add build to cart', data: '' });
      })
    );
  }
}
