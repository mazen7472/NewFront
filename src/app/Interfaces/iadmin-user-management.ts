// RoleType enum (must match your backend RoleType enum values)
export enum RoleType {
  Admin = 'Admin',
  Customer = 'Customer',
  TechCompany = 'TechCompany',
  DeliveryPerson = 'DeliveryPerson',
}

// Generic API Response
export interface GeneralResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// User DTO from API (you can expand it to match your actual backend DTO)
export interface AdminUserDTO {
  id: string;
  fullName: string;
  email: string;
  roles: RoleType[];
  isActive: boolean;
  createdAt: string;
}

// Paged list response
export interface PagedUserResponse {
  items: AdminUserDTO[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

// Change roles request
export interface UserRolesUpdateDTO {
  roles: RoleType[];
}

// Statistics DTO (adjust fields based on backend response)
export interface UserStatisticsDTO {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersPerRole: { role: RoleType; count: number }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}