import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../Environment/environment';

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface RoleAssignment {
  userEmail: string;
  roleName: string;
}

export interface RoleResponse {
  success: boolean;
  message: string;
  data: Role[];
}

export interface RegistrationOptions {
  success: boolean;
  message: string;
  data: {
    roles: Role[];
    enumValues: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = `${Environment.baseUrl}/Roles`;

  constructor(private http: HttpClient) {}

  // Check if user has a specific role
  checkRole(userId: string, roleName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/check-role`, { userId, roleName });
  }

  // Assign role to user
  assignRole(assignment: RoleAssignment): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign`, assignment);
  }

  // Unassign role from user
  unassignRole(assignment: RoleAssignment): Observable<any> {
    return this.http.post(`${this.apiUrl}/unassign`, assignment);
  }

  // Get all roles
  getAllRoles(): Observable<RoleResponse> {
    return this.http.get<RoleResponse>(`${this.apiUrl}/all`);
  }

  // Get registration options
  getRegistrationOptions(): Observable<RegistrationOptions> {
    return this.http.get<RegistrationOptions>(`${this.apiUrl}/registration-options`);
  }

  // Get enum values
  getEnumValues(): Observable<any> {
    return this.http.get(`${this.apiUrl}/enum-values`);
  }
} 