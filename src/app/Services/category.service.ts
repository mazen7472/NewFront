import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Environment } from '../Environment/environment';
import { IGeneralResponse, ICategoryWithProducts, ICategory } from '../Interfaces/icategory';
import { IProduct } from '../Interfaces/iproduct';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${Environment.baseUrl}/Category`;

  constructor(private http: HttpClient) { 
    console.log('🔧 CategoryService initialized with API URL:', this.apiUrl);
    console.log('🔧 Environment.useHttps:', Environment.useHttps);
    console.log('🔧 Environment.baseUrl:', Environment.baseUrl);
  }

  getAllCategories(): Observable<IGeneralResponse<ICategoryWithProducts[]>> {
    console.log('🔍 Fetching all categories from:', `${this.apiUrl}/All`);
    console.log('🔧 Full URL being called:', `${this.apiUrl}/All`);
    
    // Add headers to help with SSL certificate issues in development
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this.http.get<IGeneralResponse<ICategoryWithProducts[]>>(`${this.apiUrl}/All`, { headers }).pipe(
      catchError((error) => {
        console.error('❌ Error fetching categories:', error);
        console.error('❌ Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message
        });
        
        // Handle SSL certificate errors specifically
        if (error && (error.code === 'ERR_SSL_WRONG_VERSION_NUMBER' || error.message?.includes('SSL'))) {
          console.warn('🔒 SSL certificate error detected. This is expected in development.');
          console.warn('💡 To resolve this, please:');
          console.warn('   1. Visit https://localhost:7230 in your browser and accept the certificate');
          console.warn('   2. Or change environment.ts to use HTTP instead of HTTPS');
          console.warn('   3. Or configure your backend to use proper SSL certificates');
        }
        
        return of({
          success: false,
          message: 'Failed to load categories due to SSL certificate issue',
          data: []
        });
      })
    );
  }

  getCategoryById(id: string): Observable<IGeneralResponse<ICategoryWithProducts>> {
    console.log(`🔍 Fetching category by ID: ${id} from: ${this.apiUrl}/GetCategory/${id}`);
    
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this.http.get<IGeneralResponse<ICategoryWithProducts>>(`${this.apiUrl}/GetCategory/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error(`❌ Error fetching category by ID ${id}:`, error);
        console.error('❌ Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message
        });
        
        if (error && (error.code === 'ERR_SSL_WRONG_VERSION_NUMBER' || error.message?.includes('SSL'))) {
          console.warn('🔒 SSL certificate error for category details');
        }
        
        return of({
          success: false,
          message: 'Failed to load category details due to SSL certificate issue',
          data: {
            id: '',
            name: '',
            description: '',
            image: null,
            products: [],
            subCategories: []
          }
        });
      })
    );
  }
  getCategoryByName(name: string): Observable<IGeneralResponse<ICategoryWithProducts>> {
    console.log(`🔍 Fetching category by Name: ${name} from: ${this.apiUrl}/GetByName/${name}`);
    
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this.http.get<IGeneralResponse<ICategoryWithProducts>>(`${this.apiUrl}/GetByName/${name}`, { headers }).pipe(
      catchError((error) => {
        console.error(`❌ Error fetching category by ID ${name}:`, error);
        console.error('❌ Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message
        });
        
        if (error && (error.code === 'ERR_SSL_WRONG_VERSION_NUMBER' || error.message?.includes('SSL'))) {
          console.warn('🔒 SSL certificate error for category details');
        }
        
        return of({
          success: false,
          message: 'Failed to load category details due to SSL certificate issue',
          data: {
            id: '',
            name: '',
            description: '',
            image: null,
            products: [],
            subCategories: []
          }
        });
      })
    );
  }

  getProductsByCategory(categoryId: string): Observable<IGeneralResponse<IProduct[]>> {
    console.log(`🔍 Fetching products by category ID: ${categoryId} from: ${this.apiUrl}/GetCategory/${categoryId}`);
    
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this.http.get<IGeneralResponse<IProduct[]>>(`${this.apiUrl}/GetCategory/${categoryId}`, { headers }).pipe(
      catchError((error) => {
        console.error(`❌ Error fetching products by category ${categoryId}:`, error);
        console.error('❌ Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message
        });
        
        if (error && (error.code === 'ERR_SSL_WRONG_VERSION_NUMBER' || error.message?.includes('SSL'))) {
          console.warn('🔒 SSL certificate error for category products');
        }
        
        return of({
          success: false,
          message: 'Failed to load category products due to SSL certificate issue',
          data: []
        });
      })
    );
  }
}
