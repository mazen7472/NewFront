import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralResponse } from './api.service';
import {
  AdminUserDTO,
  ApiResponse,
  UserRolesUpdateDTO,
  UserStatisticsDTO
} from '../Interfaces/iadmin-user-management';
import { Environment } from '../Environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminUserManagementService {
  private baseUrl = `${Environment.baseUrl}/admin/users`; // ✅ Full API URL

  constructor(private http: HttpClient) {}

  /** Get JWT Auth Headers */
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

  /** Get paginated list of users */
  getAllUsers(page: number, size: number): Observable<ApiResponse<{ items: AdminUserDTO[] }>> {
    const headers = this.getHeaders();
    return this.http.get<ApiResponse<{ items: AdminUserDTO[] }>>(
      `${this.baseUrl}?page=${page}&size=${size}`,
      { headers }
    );
  }

  /** Get single user by ID */
  getUserById(id: string): Observable<GeneralResponse<AdminUserDTO>> {
    const headers = this.getHeaders();
    return this.http.get<GeneralResponse<AdminUserDTO>>(
      `${this.baseUrl}/${id}`,
      { headers }
    );
  }

  /** Deactivate a user */
  deactivateUser(id: string): Observable<GeneralResponse<string>> {
    const headers = this.getHeaders();
    return this.http.put<GeneralResponse<string>>(
      `${this.baseUrl}/${id}/deactivate`,
      {},
      { headers }
    );
  }

  /** Activate a user */
  activateUser(id: string): Observable<GeneralResponse<string>> {
    const headers = this.getHeaders();
    return this.http.put<GeneralResponse<string>>(
      `${this.baseUrl}/${id}/activate`,
      {},
      { headers }
    );
  }

  /** Change a user's roles */
  changeUserRoles(userId: string, dto: UserRolesUpdateDTO): Observable<ApiResponse<null>> {
    const headers = this.getHeaders();
    return this.http.put<ApiResponse<null>>(
      `${this.baseUrl}/${userId}/roles`,
      dto,
      { headers }
    );
  }

  /** Get statistics */
  getUserStatistics(): Observable<GeneralResponse<UserStatisticsDTO>> {
    const headers = this.getHeaders();
    return this.http.get<GeneralResponse<UserStatisticsDTO>>(
      `${this.baseUrl}/statistics`,
      { headers }
    );
  }
}
