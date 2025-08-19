import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CustomerService } from '../../Services/customer.service';
import { TechCompanyService } from '../../Services/tech-company.service';
import { DeliveryPerson, DeliveryPersonService } from '../../Services/delivery-person.service';
import { AdminService } from '../../Services/admin.service';
import { RolesService } from '../../Services/roles.service';
import { OrderService } from '../../Services/order.service';
import { WishlistService } from '../../Services/wishlist.service';
import { MaintenanceService } from '../../Services/maintenance.service';
import { DeliveryService } from '../../Services/delivery.service';
import { ImageUtilityService } from '../../Services/image-utility.service';
import { Subscription } from 'rxjs';
import { UserProfileService } from '../../Services/user-profile.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Environment } from '../../Environment/environment';
import { UpdateLocation } from '../../Interfaces/iuser-profile';
import { ToastrService } from 'ngx-toastr';
import { DeliveryPersonStatus, DeliveryPersonUpdateDTO } from '../../Interfaces/idelvery-person';
import { DelveryPersonService } from '../../Services/delvery-person.service';
import { GeneralResponse } from '../../Interfaces/iorder';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, 
    RouterModule,
    GoogleMapsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  form: FormGroup;
  center = { lat: 30.033333, lng: 31.233334 };
  zoom = 6;
  markerPosition: google.maps.LatLngLiteral | null = null;
  
  
  statuses = DeliveryPersonStatus; // enum reference
  deliveryPersonId: string = '123'; // replace with dynamic id (e.g., from route param)
  isLoading = false;
  message: string = '';
  userData: any = null;
  userRoles: string[] = [];
  roleSpecificData: any = {};
  profilePhotoUrl: string = 'assets/Images/default-profile.jpg';
  totalOrders: number = 0;
  activeOrders: number = 0;
  totalWishlist: number = 0;
  wishlistItems: number = 0;
  maintenanceRequests: number = 0;
  deliveries: number = 0;
  pendingProducts: number = 0;
  loading = false;
  error = '';
  currentDate = new Date();

  // Add localStorage property for template access
  localStorage = localStorage;

  private imageUtilityService = inject(ImageUtilityService);
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private techCompanyService: TechCompanyService,
    private deliveryPersonService: DeliveryPersonService,
    private adminService: AdminService,
    private rolesService: RolesService,
    private orderService: OrderService,
    private wishlistService: WishlistService,
    private maintenanceService: MaintenanceService,
    private deliveryService: DeliveryService,
    private UserProfileService: UserProfileService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private deliveryPersonService2: DelveryPersonService
  ) {
    this.form = this.fb.group({
      postalCode: [''],
      latitude: [''],
      longitude: [''],
    });
    
  }
  updateForm: FormGroup = this.fb.group({
      phoneNumber: ['', Validators.required],
      city: [''],
      country: [''],
      vehicleNumber: [''],
      vehicleType: [''],
      vehicleImage: [''],
      isAvailable: [false],
      accountStatus: [DeliveryPersonStatus.Pending, Validators.required],
    });;

  setMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const coords = event.latLng.toJSON();
      this.markerPosition = coords;

      this.form.patchValue({
        latitude: coords.lat,
        longitude: coords.lng,
      });
    }
  }

  submit() {
  if (this.form.invalid) {
    console.warn("Form is invalid!");
    return;
  }

  const dto: UpdateLocation = {
    postalCode: this.form.value.postalCode,
    latitude: +this.form.value.latitude,
    longitude: +this.form.value.longitude
  };

  this.UserProfileService.updateLocation(dto).subscribe({
    next: (res) => {
      console.log("✅ Location updated:", res);
      this.toaster.success(res.message)

      // Clear form and marker
      this.form.reset();
      this.markerPosition = null;

      // Optional: toastr
      // this.toastr.success("Location updated successfully!");
    },
    error: (err) => {
      console.error("❌ Failed to update location:", err);
      // this.toastr.error("Failed to update location");
    }
  });
}


  ngOnInit(): void {
    this.deliveryPersonService2.getById(this.deliveryPersonId).subscribe(person => {
    this.updateForm.patchValue(person);
  });
    this.loadUserProfile();
    this.loadWishListInfo();
    
    // For testing purposes - if no roles are detected, set default roles
    if (this.userRoles.length === 0) {
      console.log('No roles detected, setting default roles for testing');
    }
  }
  

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  loadUserProfile(): void {
    this.loading = true;
    this.error = '';

    // Get user roles from localStorage
    const userRoles = localStorage.getItem('userRoles');
    if (userRoles) {
      this.userRoles = JSON.parse(userRoles);
    }

    // Load profile photo
    this.loadProfilePhoto();

    console.log('Profile loading - User roles:', this.userRoles);
    console.log('Profile loading - localStorage data:', {
      userId: localStorage.getItem('userId'),
      customerId: localStorage.getItem('customerId'),
      userName: localStorage.getItem('userName'),
      userEmail: localStorage.getItem('userEmail'),
      userToken: localStorage.getItem('userToken') ? 'Present' : 'Missing'
    });

    // Get user data - try multiple sources
    const userId = localStorage.getItem('userId');
    const customerId = localStorage.getItem('customerId');
    const userName = localStorage.getItem('userName');

    if (userId || customerId || userName) {
      this.loadUserDataByRole(userId || customerId);
    } else {
      this.error = 'User not authenticated';
      this.loading = false;
    }

    this.UserProfileService.getUserProfile().subscribe({
      next: (profile) => {
        console.log('User profile response:', profile);
        if (profile.success) {
          this.userData = profile.data;
          console.log('User profile loaded:', this.userData);
        } else {
          console.error('Failed to load user profile:', profile.message);
        }
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
        this.error = 'Failed to load user profile';
      },
      complete: () => {
        this.loading = false;
      }
    })

  }

  private loadWishListInfo(): void {
    const customerId = localStorage.getItem('customerId');
    if (customerId) {
      this.subscriptions.push(
        this.wishlistService.getWishListByCustomerId(customerId).subscribe({
          next: (response: any) => {
            console.log('Wishlist response:', response);
            if (response.success) {
              this.totalWishlist = response.data[0].items?.length || 0;
              console.log('Wishlist items loaded:', this.totalWishlist);
            } else {
              console.error('Failed to load wishlist:', response.message);
            }
          },
          error: (err: any) => {
            console.error('Error loading wishlist:', err);
          }
        })
      );
    } else {
      console.warn('No customer ID found for loading wishlist');
    }
  }

  private loadProfilePhoto(): void {
    const userId =
      localStorage.getItem('customerId') || localStorage.getItem('userId');
    const storedPhotoName = localStorage.getItem('profilePhotoUrl') || 'photo';

    if (userId) {
      // Try to get profile image from API first
      this.subscriptions.push(
        this.imageUtilityService
          .getProfileImageUrlFromAPI(userId, storedPhotoName)
          .subscribe({
            next: (imageUrl) => {
              this.profilePhotoUrl = imageUrl;
            },
            error: (error) => {
              console.warn(
                'Failed to load profile image from API, using static URL:',
                error
              );
              // Fallback to static URL
              this.profilePhotoUrl =
                this.imageUtilityService.getProfileImageUrl(
                  userId,
                  storedPhotoName
                );
              if (storedPhotoName) {
                // Ensure clean URL building
                const apiBaseUrl = Environment.baseImageUrl.replace(/\/+$/, '');
                const cleanedPath = storedPhotoName.replace(/^\/+/, '');

                this.profilePhotoUrl = `${apiBaseUrl}/${cleanedPath}`;
                console.log('Profile photo URL:', this.profilePhotoUrl);
              }
            },
          })
      );

    } else {
      // No user ID, use default profile image
      this.profilePhotoUrl = 'assets/Images/default-profile.jpg';
    }
  }

  private loadUserDataByRole(userId: string | null): void {
    if (!userId) {
      // If no user ID, try to load basic user data from localStorage
      this.loadBasicUserData();
      return;
    }

    // Try to load customer data first
    this.subscriptions.push(
      this.customerService.getCustomerById(userId).subscribe({
        next: (response) => {
          if (response.success) {
            this.userData = response.data;
          } else {
            // If customer data fails, try to load basic user data
            this.loadBasicUserData();
          }
          
          // Load additional data based on roles regardless of customer data success
          this.loadRoleSpecificData();
          this.loadQuickStats();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading customer data:', err);
          // If customer data fails, try to load basic user data
          this.loadBasicUserData();
          this.loadRoleSpecificData();
          this.loadQuickStats();
          this.loading = false;
        }
      })
    );
  }

  private loadBasicUserData(): void {
    // Load basic user data from localStorage
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    
    this.userData = {
      name: userName || 'User',
      userName: userName || 'user',
      email: userEmail || 'user@example.com',
      phone: 'Not provided',
      address: 'Not provided',
      registrationDate: new Date().toISOString(),
      isActive: true
    };
  }

  private loadRoleSpecificData(): void {
    // Load data based on user roles
    if (this.hasRoleWithId('TechCompany')) {
      this.loadTechCompanyData();
    }
    if (this.hasRoleWithId('DeliveryPerson')) {
      this.loadDeliveryPersonData();
    }
    if (this.hasRoleWithId('Admin')) {
      this.loadAdminData();
    }
  }

  private loadTechCompanyData(): void {
    const techCompanyId = localStorage.getItem('techCompanyId');
    if (techCompanyId) {
      console.log('Loading tech company data for ID:', techCompanyId);
      this.subscriptions.push(
        this.techCompanyService.getTechCompanyById(techCompanyId).subscribe({
          next: (response) => {
            if (response.success) {
              this.roleSpecificData.techCompany = response.data;
            }
          },
          error: (err) => {
            console.error('Error loading tech company data:', err);
          }
        })
      );
    } else {
      console.error('Tech company ID not found in localStorage');
    }
  }

  private loadDeliveryPersonData(): void {
    const deliveryPersonId = localStorage.getItem('deliveryPersonId');
    if (deliveryPersonId) {
      console.log('Loading delivery person data for ID:', deliveryPersonId);
      this.subscriptions.push(
        this.deliveryPersonService.getDeliveryPersonById(deliveryPersonId).subscribe({
          next: (response) => {
            if (response.success) {
              this.roleSpecificData.deliveryPerson = response.data;
            }
          },
          error: (err) => {
            console.error('Error loading delivery person data:', err);
          }
        })
      );
    } else {
      console.error('Delivery person ID not found in localStorage');
    }
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      const formValue = this.updateForm.value;
      console.log('Submitting form:', formValue);

      this.deliveryPersonService2.update(this.deliveryPersonId, formValue).subscribe({
        next: () => console.log('Profile updated successfully'),
        error: (err) => console.error('Update failed', err),
      });
    }
  }

  private loadAdminData(): void {
    const adminId = localStorage.getItem('adminId');
    if (adminId) {
      console.log('Loading admin data for ID:', adminId);
      this.subscriptions.push(
        this.adminService.getAdminById(adminId).subscribe({
          next: (response) => {
            if (response.success) {
              this.roleSpecificData.admin = response.data;
            }
          },
          error: (err) => {
            console.error('Error loading admin data:', err);
          }
        })
      );
    } else {
      console.error('Admin ID not found in localStorage');
    }
  }

  private loadQuickStats(): void {
    const userId = localStorage.getItem('userId');
    const customerId = localStorage.getItem('customerId');
    const currentUserId = userId || customerId;
    
    if (!currentUserId) {
      console.log('No user ID found for loading stats');
      return;
    }

    // Load customer orders only if user has customer role
    if (this.isCustomer()) {
      this.subscriptions.push(
        this.orderService.getOrdersByCustomer(currentUserId).subscribe({
          next: (response) => {
            if (response.success) {
              this.totalOrders = response.data.length;
              this.activeOrders = response.data.filter((order: any) => 
                order.status !== 'Delivered' && order.status !== 'Cancelled'
              ).length;
            }
          },
          error: (err) => {
            console.error('Error loading orders:', err);
          }
        })
      );

      // Load wishlist items only if user has customer role
      this.subscriptions.push(
        this.wishlistService.getWishListByCustomerId(currentUserId).subscribe({
          next: (response: any) => {
            if (response.success) {
              this.wishlistItems = response.data[0].items?.length || 0;
            }
          },
          error: (err: any) => {
            console.error('Error loading wishlist:', err);
          }
        })
      );
    }

    // Load role-specific stats
    this.loadRoleSpecificStats();
  }

  private loadRoleSpecificStats(): void {
    this.userRoles.forEach(role => {
      switch (role) {
        case 'TechCompany':
          this.loadTechCompanyStats();
          break;
        case 'DeliveryPerson':
          this.loadDeliveryPersonStats();
          break;
        case 'Admin':
          this.loadAdminStats();
          break;
      }
    });
  }

  private loadTechCompanyStats(): void {
    const techCompanyId = localStorage.getItem('techCompanyId');
    if (techCompanyId) {
      // Load maintenance requests
      this.subscriptions.push(
        this.maintenanceService.getMaintenanceByTechCompany(techCompanyId).subscribe({
          next: (response) => {
            console.log(response);
            if (response.success) {
              this.maintenanceRequests = response.data.length;
            }
          },
          error: (err) => {
            console.error('Error loading tech company stats:', err);
          }
        })
      );
    }
  }

  private loadDeliveryPersonStats(): void {
    const deliveryPersonId = localStorage.getItem('deliveryPersonId');
    if (deliveryPersonId) {
      // Load deliveries
      this.subscriptions.push(
        this.deliveryService.getDeliveriesByDeliveryPerson(deliveryPersonId).subscribe({
          next: (response) => {
            if (response.success) {
              this.deliveries = response.data.length;
            }
          },
          error: (err) => {
            console.error('Error loading delivery person stats:', err);
          }
        })
      );
    }
  }

  private loadAdminStats(): void {
    const adminId = localStorage.getItem('adminId');
    if (adminId) {
      // Load admin stats
      this.subscriptions.push(
        this.adminService.getDashboardStats().subscribe({
          next: (response) => {
            if (response.success) {
              this.pendingProducts = response.data.pendingProducts || 0;
              this.totalOrders = response.data.totalOrders || 0;
            }
          },
          error: (err) => {
            console.error('Error loading admin stats:', err);
          }
        })
      );
    }
  }

  hasRoleWithId(role: string): boolean {
  switch (role) {
    case 'Admin':
      return this.userRoles.includes('Admin') && !!localStorage.getItem('adminId');
    case 'TechCompany':
      return this.userRoles.includes('TechCompany') && !!localStorage.getItem('techCompanyId');
    case 'Customer':
      return this.userRoles.includes('Customer') && !!localStorage.getItem('customerId');
    case 'DeliveryPerson':
      return this.userRoles.includes('DeliveryPerson') && !!localStorage.getItem('deliveryPersonId');
    default:
      return false;
  }
}

// Updated helper methods
isAdmin(): boolean {
  return !!localStorage.getItem('adminId');
}
isTechCompany(): boolean {
  return !!localStorage.getItem('techCompanyId');
}
isCustomer(): boolean {
  return !!localStorage.getItem('customerId');
}
isDeliveryPerson(): boolean {
  return !!localStorage.getItem('deliveryPersonId');
}



  getDashboardRoute(): string {
    if (this.isAdmin()) {
      return '/dashboard';
    } else if (this.isTechCompany()) {
      return '/tech-company/dashboard';
    } else if (this.isDeliveryPerson()) {
      return '/delivery/dashboard';
    } else {
      return '/customer/orders';
    }
  }

  redirectToDashboard(): void {
    // Only redirect if user has a clear primary role
    const dashboardRoute = this.getDashboardRoute();
    
    // Check if we're already on a dashboard page to avoid infinite redirects
    const currentPath = window.location.pathname;
    if (currentPath.includes('/dashboard') || currentPath.includes('/customer/') || 
        currentPath.includes('/tech-company/') || currentPath.includes('/delivery/')) {
      return;
    }
    
    // Redirect to appropriate dashboard
    window.location.href = dashboardRoute;
  }

  getPrimaryRole(): string {
    // Return the primary role for display purposes
    if (this.isAdmin()) return 'Admin';
    if (this.isTechCompany()) return 'TechCompany';
    if (this.isDeliveryPerson()) return 'DeliveryPerson';
    if (this.isCustomer()) return 'Customer';
    return 'User';
  }

  // Helper methods for template access
  getUserId(): string {
    return localStorage.getItem('userId') || 'Not found';
  }

  getCustomerId(): string {
    return localStorage.getItem('customerId') || 'Not found';
  }

  getUserName(): string {
    return localStorage.getItem('userName') || 'Not found';
  }

  // Role badge styling methods
  getRoleBadgeClass(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'role-badge admin';
      case 'techcompany':
        return 'role-badge tech-company';
      case 'customer':
        return 'role-badge customer';
      case 'deliveryperson':
        return 'role-badge delivery';
      default:
        return 'role-badge default';
    }
  }

  getRoleIcon(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bi-shield-check';
      case 'techcompany':
        return 'bi-tools';
      case 'customer':
        return 'bi-person';
      case 'deliveryperson':
        return 'bi-truck';
      default:
        return 'bi-person';
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/Images/default-profile.jpg';
    }
  }

  logout(): void {
    // Clear all stored data
    localStorage.clear();
    // Redirect to login page
    window.location.href = '/login';
  }

  hasAnyDashboardAccess(): boolean {
    return this.isAdmin() || this.isTechCompany() || this.isDeliveryPerson() || this.isCustomer();
  }

  contactAdmin(): void {
    // You can implement this to open a contact form or redirect to contact page
    window.location.href = '/contact';
  }
} 