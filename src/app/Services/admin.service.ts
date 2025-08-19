import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Environment } from '../Environment/environment';
import { GeneralResponse, OrderReadDTO } from './api.service';

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingProducts: number;
  activeOrders: number;
  completedOrders: number;
}

export interface AdminResponse {
  success: boolean;
  message: string;
  data: Admin[];
}

export interface SingleAdminResponse {
  success: boolean;
  message: string;
  data: Admin;
}

export interface AdminStatsResponse {
  success: boolean;
  message: string;
  data: AdminStats;
}

export interface UserRole {
  userId: string;
  userName: string;
  email: string;
  currentRoles: string[];
  availableRoles: string[];
}

export interface RoleAssignmentRequest {
  userId: string;
  roleId: string;
}

export interface RoleUnassignmentRequest {
  userId: string;
  roleId: string;
}

export interface UserRoleResponse {
  success: boolean;
  message: string;
  data: UserRole[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${Environment.baseUrl}/Admins`;

  constructor(private http: HttpClient) {}

  // Get all admins
  getAllAdmins(): Observable<AdminResponse> {
    return this.http.get<AdminResponse>(`${this.apiUrl}/all`);
  }

  // Get admin by ID
  getAdminById(id: string): Observable<SingleAdminResponse> {
    return this.http.get<SingleAdminResponse>(`${this.apiUrl}/${id}`);
  }

  // Get all users with their roles for role management
  getAllUsersWithRoles(): Observable<UserRoleResponse> {
    return this.http.get<UserRoleResponse>(`${this.apiUrl}/users`);
  }

  // Assign role to user
  assignRoleToUser(userId: string, roleId: string): Observable<any> {
    const request: RoleAssignmentRequest = { userId, roleId };
    return this.http.post(`${this.apiUrl}/users/roles/assign`, request);
  }

  // Unassign role from user
  unassignRoleFromUser(userId: string, roleId: string): Observable<any> {
    const request: RoleUnassignmentRequest = { userId, roleId };
    return this.http.post(`${this.apiUrl}/users/roles/unassign`, request);
  }

  // Get available roles
  getAvailableRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/roles/available`);
  }

  // Get pending products
  getPendingProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/pending`);
  }

  // Approve product
  approveProduct(productId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/products/${productId}/approve`, {});
  }

  // Reject product
  rejectProduct(productId: string, reason: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/products/${productId}/reject`, { reason });
  }

  // Get all orders
  getAllOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders`);
  }

  // Get orders by status
  getOrdersByStatus(status: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/status/${status}`);
  }

  // Update order status
  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderId}/status`, { status });
  }

  // Mark order as in progress
  markOrderInProgress(orderId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderId}/mark-in-progress`, {});
  }

  // Mark order as delivered
  markOrderDelivered(orderId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderId}/mark-delivered`, {});
  }

  // Mark order as pending
  markOrderPending(orderId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderId}/mark-pending`, {});
  }

  // Get dashboard stats
  getDashboardStats(): Observable<AdminStatsResponse> {
    return this.http.get<AdminStatsResponse>(`${this.apiUrl}/dashboard/stats`);
  }

  getOrders(): Observable<GeneralResponse<OrderReadDTO[]>> {
      return this.http.get<GeneralResponse<OrderReadDTO[]>>(`${this.apiUrl}/orders`).pipe(
        catchError((error) => {
          console.error('Failed to fetch orders by customer ID', error);
          return throwError(() => error);
        })
      );
    }
}
