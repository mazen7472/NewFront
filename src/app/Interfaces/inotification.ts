export enum NotificationType {
  OrderCreated = 'OrderCreated',
  OrderStatusChanged = 'OrderStatusChanged',
  OrderAssignedToDelivery = 'OrderAssignedToDelivery',

  ProductAdded = 'ProductAdded',
  ProductApproved = 'ProductApproved',
  ProductRejected = 'ProductRejected',
  ProductPending = 'ProductPending',

  MaintenanceRequestCreated = 'MaintenanceRequestCreated',
  MaintenanceRequestAccepted = 'MaintenanceRequestAccepted',
  MaintenanceRequestCompleted = 'MaintenanceRequestCompleted',

  DeliveryOfferCreated = 'DeliveryOfferCreated',
  DeliveryOfferAccepted = 'DeliveryOfferAccepted',
  DeliveryOfferExpired = 'DeliveryOfferExpired',
  DeliveryAssigned = 'DeliveryAssigned',
  DeliveryPickedUp = 'DeliveryPickedUp',
  DeliveryCompleted = 'DeliveryCompleted',

  SystemAlert = 'SystemAlert',
}


export enum RoleType {
  Admin = 'Admin',
  User = 'User',
  // etc.
}

export interface NotificationDTO {
  id: string;
  receiverUserId: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string; // ISO date string
  relatedEntityId?: string;
  relatedEntityType?: string;
  receiverName?: string;
}

export interface CreateNotificationDTO {
  receiverUserId: string;
  message: string;
  type: NotificationType;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export interface NotificationReadDTO {
  id: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export interface NotificationCountDTO {
  totalCount: number;
  unreadCount: number;
}

export interface SendToMultipleUsersNotificationDTO {
  userIds: string[];
  message: string;
  type: NotificationType;
  relatedEntityId?: string;
  relatedEntityType?: string;
}
export interface GeneralResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}