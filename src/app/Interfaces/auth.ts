export interface RegisterRequest {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  phoneNumber: string;
  city?: string;
  country?: string;
  profilePhoto?: File;
}

export interface RegisterRequestWithRole extends RegisterRequest {
  role: string; // This will be sent as a query parameter
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DeleteAccountRequest {
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    userId: string;
    userName: string;
    fullName: string;
    userRoles: string[];
    roleName: string[];
    customerId?: string;
    adminId?: string;
    techCompanyId?: string;
    deliveryPersonId?: string;
    cartId?: string;
    wishListId?: string;
    pcAssemblyId?: string | null;
    expiresAt?: string;
    profilePhotoUrl?: string;
  };
}

export interface UserProfile {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  address: string;
  city: string;
  country: string;
  profilePhotoUrl: string;
  createdAt: string;
  updatedAt: string;
  phoneNumber: string;
  registrationDate: string;
  lastLoginDate?: string;
  isActive: boolean;
  roles: string[];
}