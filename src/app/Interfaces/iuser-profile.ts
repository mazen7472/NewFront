// src/app/models/user-profile.model.ts

export interface GeneralResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface UserProfile {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  profilePhotoUrl?: string; // Assuming API returns a photo URL
}

export interface UserProfileUpdateDTO {
  fullName?: string;
  userName?:string
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  profilePhoto?: File | null;
}

export interface UserProfilePhotoUploadDTO {
  profilePhoto?: File | null;
}


export interface UpdateLocation {
  postalCode: string;
  latitude: number;
  longitude: number;
}

export interface UpdatePassword {
  CurrentPassword: string;
  NewPassword: string;
  ConfirmNewPassword: string;
}
