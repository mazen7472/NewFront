export interface GeneralProfileReadDTO {
  userId: string;
  userName: string;
  email?: string;
  phoneNumber?: string;
  fullName: string;
  address: string;
  city?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  profilePhotoUrl?: string;
  isActive: boolean;
  roleNames: string[];
  createdAt: string;   // ISO string from backend DateTime
  lastLogin?: string;
}