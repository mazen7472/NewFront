import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GeneralResponse } from './cart.service';
import { UpdateLocation, UpdatePassword, UserProfilePhotoUploadDTO, UserProfileUpdateDTO } from '../Interfaces/iuser-profile';
import { UserProfile } from '../Interfaces/auth';
import { Environment } from '../Environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private readonly apiUrl = `${Environment.baseUrl}/user/profile`;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /** Get token from localStorage (SSR safe) */
  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (this.isBrowser) {
      const token = localStorage.getItem('userToken');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  /** Get the current user's profile */
  getUserProfile(): Observable<GeneralResponse<UserProfile>> {
    return this.http.get<GeneralResponse<UserProfile>>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  /** Update user profile (supports file upload) */
  updateUserProfile(dto: UserProfileUpdateDTO): Observable<GeneralResponse<UserProfile>> {
  const formData = new FormData();

  // Append only if provided
  if (dto.fullName !== undefined) formData.append('FullName', dto.fullName);
  if (dto.userName !== undefined) formData.append('UserName', dto.userName)
  if (dto.email !== undefined) formData.append('Email', dto.email);
  if (dto.phoneNumber !== undefined) formData.append('PhoneNumber', dto.phoneNumber);
  if (dto.address !== undefined) formData.append('Address', dto.address);
  if (dto.city !== undefined) formData.append('City', dto.city);
  if (dto.country !== undefined) formData.append('Country', dto.country);

  // Append image if exists
  if (dto.profilePhoto instanceof File) {
    formData.append('ProfilePhoto', dto.profilePhoto);
  }

  // Don’t set Content-Type manually, Angular will handle it
  return this.http.put<GeneralResponse<UserProfile>>(this.apiUrl, formData, {
    headers: this.getAuthHeaders()
  });
}


  /** Upload only profile photo */
  uploadProfilePhoto(dto: UserProfilePhotoUploadDTO): Observable<GeneralResponse<string>> {
    const formData = new FormData();
    if (dto.profilePhoto) {
      formData.append('ProfilePhoto', dto.profilePhoto);
    }
    return this.http.post<GeneralResponse<string>>(`${this.apiUrl}/upload-photo`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  getUserProfileImage(): Observable<string | null> {
    return new Observable(observer => {
      this.getUserProfile().subscribe({
        next: res => {
          const imageUrl = res.data?.profilePhotoUrl || null;
          observer.next(imageUrl);
          observer.complete();
        },
        error: () => {
          observer.next(null);
          observer.complete();
        }
      });
    });
  }

  changePassword(dto: FormData): Observable<GeneralResponse<string>>{
    return this.http.post<GeneralResponse<string>>(`${this.apiUrl}/change-password`, dto, {
      headers: this.getAuthHeaders()
    });
  }

  updateLocation(dto : UpdateLocation): Observable<GeneralResponse<string>> {
    return this.http.put<GeneralResponse<string>>(`${this.apiUrl}/update-location`, dto, {
      headers: this.getAuthHeaders()
    });
  }
}
