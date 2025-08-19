export interface ServiceUsageCreateDTO {
  serviceType: string;
  usedOn: string; // ISO date string
  callCount: number;
}

export interface ServiceUsageUpdateDTO {
  serviceType?: string;
  usedOn?: string;
  callCount?: number;
}

export interface ServiceUsageResponse {
  id: string;
  serviceType: string;
  usedOn: string;
  callCount: number;
}

export interface GeneralResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
