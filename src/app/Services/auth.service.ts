import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Environment } from '../Environment/environment';
import { jwtDecode } from 'jwt-decode';
import { 
  RegisterRequest, 
  LoginRequest, 
  ForgotPasswordRequest, 
  ResetPasswordRequest, 
  AuthResponse 
} from '../Interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _HttpClient = inject(HttpClient);
  private readonly _Router = inject(Router);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _isBrowser = isPlatformBrowser(this._platformId);

  userData: any = null;
  customerId: string | null = null;
  userName: string | null = null;

  private isLoggedInSubject = new BehaviorSubject<boolean>(this._isBrowser ? this.hasToken() : false);
  private userNameSubject = new BehaviorSubject<string | null>(null);

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userName$ = this.userNameSubject.asObservable();

  private hasToken(): boolean {
    return this._isBrowser && !!localStorage.getItem('userToken');
  }

  // Helper method to convert object to FormData
  private objectToFormData(obj: any): FormData {
    const formData = new FormData();
    
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    
    return formData;
  }

  // Register user with FormData
  register(data: RegisterRequest, role: string): Observable<AuthResponse> {
    const formData = this.objectToFormData(data);
    formData.append('role', role);
    
    return this._HttpClient.post<AuthResponse>(`${Environment.baseUrl}/Authentication/register`, formData);
  }

  // Login user with FormData
  login(data: LoginRequest): Observable<AuthResponse> {
    const formData = this.objectToFormData(data);
    
    return this._HttpClient.post<AuthResponse>(`${Environment.baseUrl}/Authentication/login`, formData);
  }

 // Forgot password with FormData
forgotPassword(data: ForgotPasswordRequest): Observable<AuthResponse> {
  const formData = this.objectToFormData(data);
  return this._HttpClient.post<AuthResponse>(
    `${Environment.baseUrl}/Authentication/forgot-password`,
    formData
  );
}

// Reset password with FormData
resetPassword(data: ResetPasswordRequest): Observable<AuthResponse> {
  const formData = this.objectToFormData(data);
  return this._HttpClient.post<AuthResponse>(
    `${Environment.baseUrl}/Authentication/reset-password`,
    formData
  );
}

  // Delete account with FormData
  deleteAccount(data?: any): Observable<any> {
    const formData = data ? this.objectToFormData(data) : new FormData();
    
    return this._HttpClient.delete(`${Environment.baseUrl}/Authentication/delete-account`, { body: formData });
  }

  // Legacy method for backward compatibility
  setRegisterForm(data: object): Observable<any> {
    return this.register(data as RegisterRequest, 'Customer'); // Assuming default role for backward compatibility
  }

  // Legacy method for backward compatibility
  setloginForm(data: { Email: string; Password: string; RememberMe: boolean }): Observable<any> {
    return this.login({
      email: data.Email,
      password: data.Password,
      rememberMe: data.RememberMe
    });
  }

  saveUserData(): void {
    if (!this._isBrowser) return;

    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        this.userData = jwtDecode(token);
        this.customerId = localStorage.getItem('customerId') || localStorage.getItem('userId');
        this.userName = localStorage.getItem('userName');

        this.isLoggedInSubject.next(true);
        this.userNameSubject.next(this.userName);
        
        console.log('Auth Service - Loaded user data:', {
          customerId: this.customerId,
          userName: this.userName,
          techCompanyId: localStorage.getItem('techCompanyId'),
          deliveryPersonId: localStorage.getItem('deliveryPersonId'),
          adminId: localStorage.getItem('adminId')
        });
      } catch (err) {
        console.error('Invalid token:', err);
        this.clearUserData();
      }
    } else {
      this.clearUserData();
    }
  }

  logOut(): void {
    this.clearUserData();
    this._Router.navigate(['/login']);
  }

  initialize(): void {
    if (this._isBrowser) {
      this.saveUserData();
    }
  }

  private clearUserData(): void {
    if (!this._isBrowser) return;

    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('customerId');
    localStorage.removeItem('techCompanyId');
    localStorage.removeItem('deliveryPersonId');
    localStorage.removeItem('adminId');
    localStorage.removeItem('cartId');
    localStorage.removeItem('wishListId');
    localStorage.removeItem('pcAssemblyId');
    localStorage.removeItem('profilePhotoUrl');
    localStorage.removeItem('pcAssemblyId');

    this.userData = null;
    this.customerId = null;
    this.userName = null;

    this.isLoggedInSubject.next(false);
    this.userNameSubject.next(null);
  }
}
