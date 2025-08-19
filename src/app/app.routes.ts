import { Routes } from '@angular/router';
import { authGuard } from './Guards/auth.guard';
import { PcBuildGuard } from './Guards/pc-build.guard';
import { buildGuardGuard } from './Guards/build-guard.guard';
import { techCompanyGuard } from './Guards/tech-company.guard';
import { customerGuard } from './Guards/customer.guard';
import { adminGuard } from './Guards/admin.guard';
import { deliveryGuard } from './Guards/delivery.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent), title: 'Home Page' },

  { path: 'about', loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent), title: 'About Page' },
  { path: 'blog/:slug', loadComponent: () => import('./components/categories/article-detail/article-detail.component').then(m => m.ArticleDetailComponent), title: 'Article Details' },
  { path: 'blog', loadComponent: () => import('./components/blog/blog.component').then(m => m.BlogComponent), title: 'Blog Page' },
  { path: 'contact', loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent), title: 'Contact Page' },
  { path: 'privacy', loadComponent: () => import('./components/privacy/privacy.component').then(m => m.PrivacyComponent), title: 'Privacy Page' },
  { path: 'terms', loadComponent: () => import('./components/terms/terms.component').then(m => m.TermsComponent), title: 'Terms Page' },
  
  // New footer pages
  { path: 'watch-demo', loadComponent: () => import('./components/watch-demo/watch-demo.component').then(m => m.WatchDemoComponent), title: 'Watch Demo' },
  { path: 'leadership', loadComponent: () => import('./components/leadership/leadership.component').then(m => m.LeadershipComponent), title: 'Leadership' },
  { path: 'careers', loadComponent: () => import('./components/careers/careers.component').then(m => m.CareersComponent), title: 'Careers' },
  { path: 'investor-relations', loadComponent: () => import('./components/investor-relations/investor-relations.component').then(m => m.InvestorRelationsComponent), title: 'Investor Relations' },
  { path: 'media-kit', loadComponent: () => import('./components/media-kit/media-kit.component').then(m => m.MediaKitComponent), title: 'Media Kit' },
  { path: 'community', loadComponent: () => import('./components/community/community.component').then(m => m.CommunityComponent), title: 'Community' },
  { path: 'events', loadComponent: () => import('./components/events/events.component').then(m => m.EventsComponent), title: 'Events' },
  { path: 'help-center', loadComponent: () => import('./components/help-center/help-center.component').then(m => m.HelpCenterComponent), title: 'Help Center' },
  { path: 'partners', loadComponent: () => import('./components/partners/partners.component').then(m => m.PartnersComponent), title: 'Partners' },
 
  { path: 'products', loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent), title: 'Products Page' },
  { path: 'product-details/:id', loadComponent: () => import('./components/products/components/productdetails/productdetails.component').then(m => m.ProductdetailsComponent), title: 'Product Details' },
  { path: 'login', loadComponent: () => import('./components/log-in/log-in.component').then(m => m.LogInComponent), title: 'LogIn Page' },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent), title: 'Register Page' },
  { path: 'forgot-password', loadComponent: () => import('./components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent), title: 'Forgot Password' },
{ path: 'reset-password', loadComponent: () => import('./components/reset-password/reset-password.component').then(m => m.ResetPasswordComponent), title: 'Reset Password' },
  { path: 'cart', loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent), title: 'Cart', canActivate: [authGuard] },

  { path: 'pc-build', loadComponent: () => import('./components/pc-build/pc-build.component').then(m => m.PcBuildComponent), title: 'Creat PC Build', canActivate: [PcBuildGuard] },
  { path: 'selector', loadComponent: () => import('./components/pc-build/selector/selector.component').then(m => m.SelectorComponent), title: 'Component Selector', canActivate: [buildGuardGuard] },
  { path: 'categories', loadComponent: () => import('./components/categories/categories.component').then(m => m.CategoriesComponent), title: 'Product Categories' },
  { path: 'category-details/:id', loadComponent: () => import('./components/categories/category-details/category-details.component').then(m => m.CategoryDetailsComponent), title: 'Category Products' },
  { path: 'selector-category-details/:name', loadComponent: () => import('./components/pc-build/selector/components/selector-category-details/selector-category-details.component').then(m => m.SelectorCategoryDetailsComponent), title: 'Category Products For Build', canActivate: [buildGuardGuard] },
  { path: 'order', loadComponent: () => import('./components/order/order.component').then(m => m.OrderComponent), title: 'Order', canActivate: [authGuard] },
  { path: 'wish-list', loadComponent: () => import('./components/wishlist/wishlist.component').then(m => m.WishlistComponent), title: 'Wish List', canActivate: [authGuard] },

  { path: 'pc-compare', loadComponent: () => import('./components/pc-compare/pc-compare.component').then(m => m.PcCompareComponent), title: 'Pc Compare' },
  { path: 'test-comparison', loadComponent: () => import('./components/pc-compare/test-comparison.component').then(m => m.TestComparisonComponent), title: 'Test Comparison' },
  { path: 'debug-specifications', loadComponent: () => import('./components/pc-compare/debug-specifications.component').then(m => m.DebugSpecificationsComponent), title: 'Debug Specifications' },
  { path: 'notifications', loadComponent: () => import('./components/notifications/notifications.component').then(m => m.NotificationsComponent), title: 'Notifications', canActivate: [authGuard] },

  // Image URL Demo Route
  { path: 'image-url-demo', loadComponent: () => import('./components/image-url-demo/image-url-demo.component').then(m => m.ImageUrlDemoComponent), title: 'Image URL Demo' },

  // Profile Route - Smart redirect based on user role
  { 
    path: 'profile', 
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent), 
    title: 'Profile', 
    canActivate: [authGuard] 
  },

  // Profile Settings Route - Accessible to all authenticated users
  { path: 'profile-settings', loadComponent: () => import('./components/profile-settings/profile-settings.component').then(m => m.CustomerProfileSettingsComponent), title: 'Profile Settings', canActivate: [authGuard] },

  // Admin Dashboard Routes - Comprehensive
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Admin Dashboard',
    canActivate: [authGuard, adminGuard],
    children: [
      // Overview
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () => import('./components/dashboard/pages/overview/overview.component').then(m => m.OverviewComponent),
        title: 'Dashboard Overview'
      },
      
      // Product Management
      {
        path: 'products',
        loadComponent: () => import('./components/dashboard/components/all-products/all-products.component').then(m => m.AllProductsComponent),
        title: 'All Products'
      },
      {
        path: 'pending-products',
        loadComponent: () => import('./components/dashboard/components/pending-products/pending-products.component').then(m => m.PendingProductsComponent),
        title: 'Pending Products'
      },
      {
        path: 'edit-product/:id',
        loadComponent: () => import('./components/dashboard/pages/edit-product/edit-product.component').then(m => m.EditProductComponent),
        title: 'Edit Product'
      },
      
      // Order Management
      {
        path: 'orders',
        loadComponent: () => import('./components/dashboard/components/dashboard-order/dashboard-order.component').then(m => m.DashboardOrderComponent),
        title: 'All Orders'
      },
      {
        path: 'order-details/:id',
        loadComponent: () => import('./components/dashboard/pages/order-details/order-details.component').then(m => m.OrderDetailsComponent),
        title: 'Order Details'
      },
      
      // User Management
      {
        path: 'customers',
        loadComponent: () => import('./components/dashboard/components/customers/customers.component').then(m => m.CustomersComponent),
        title: 'All Customers'
      },
      {
        path: 'tech-companies',
        loadComponent: () => import('./components/dashboard/components/tech-companies/tech-companies.component').then(m => m.TechCompaniesComponent),
        title: 'Tech Companies'
      },
      {
        path: 'delivery-persons',
        loadComponent: () => import('./components/dashboard/components/delivery/delivery.component').then(m => m.DeliveryComponent),
        title: 'Delivery Persons'
      },
      {
        path: 'user-details/:id',
        loadComponent: () => import('./components/dashboard/pages/user-details/user-details.component').then(m => m.UserDetailsComponent),
        title: 'User Details'
      },
      {
        path: 'role-management',
        loadComponent: () => import('./components/dashboard/components/role-management/role-management.component').then(m => m.RoleManagementComponent),
        title: 'Role Management'
      },
      
      // Service Management
      {
        path: 'maintenance-requests',
        loadComponent: () => import('./components/dashboard/pages/maintenance-requests/maintenance-requests.component').then(m => m.MaintenanceRequestsComponent),
        title: 'Maintenance Requests'
      },
      {
        path: 'pc-assemblies',
        loadComponent: () => import('./components/dashboard/pages/pc-assemblies/pc-assemblies.component').then(m => m.PcAssembliesComponent),
        title: 'PC Assemblies'
      },
      
      // Delivery Management
      {
        path: 'deliveries',
        loadComponent: () => import('./components/dashboard/pages/deliveries/deliveries.component').then(m => m.DeliveriesComponent),
        title: 'All Deliveries'
      },
      {
        path: 'assign-delivery',
        loadComponent: () => import('./components/dashboard/pages/assign-delivery/assign-delivery.component').then(m => m.AssignDeliveryComponent),
        title: 'Assign Delivery'
      },
      
      // Commission Management
      {
        path: 'commissions',
        loadComponent: () => import('./components/dashboard/pages/commissions/commissions.component').then(m => m.CommissionsComponent),
        title: 'Commission Management'
      },
      {
        path: 'commission-settings',
        loadComponent: () => import('./components/dashboard/pages/commission-settings/commission-settings.component').then(m => m.CommissionSettingsComponent),
        title: 'Commission Settings'
      },
      
      // Category Management
      {
        path: 'categories',
        loadComponent: () => import('./components/dashboard/pages/categories/categories.component').then(m => m.CategoriesComponent),
        title: 'Categories'
      },
      {
        path: 'subcategories',
        loadComponent: () => import('./components/dashboard/pages/subcategories/subcategories.component').then(m => m.SubcategoriesComponent),
        title: 'Subcategories'
      },
      
      // Notifications
      {
        path: 'notifications',
        loadComponent: () => import('./components/dashboard/pages/notifications/notifications.component').then(m => m.NotificationsComponent),
        title: 'Notifications'
      },
      
      // Analytics & Reports
      {
        path: 'analytics',
        loadComponent: () => import('./components/dashboard/pages/analytics/analytics.component').then(m => m.AnalyticsComponent),
        title: 'Analytics'
      },
      {
        path: 'reports',
        loadComponent: () => import('./components/dashboard/pages/reports/reports.component').then(m => m.ReportsComponent),
        title: 'Reports'
      },
      
      // Profile Settings
      {
        path: 'profile-settings',
        loadComponent: () => import('./components/dashboard/pages/profile-settings/profile-settings.component').then(m => m.ProfileSettingsComponent),
        title: 'Profile Settings'
      }
    ]
  },

  // Tech Company Dashboard Routes - Comprehensive
  {
    path: 'tech-company',
    loadComponent: () => import('./components/tech-company-dashboard/tech-company-dashboard.component').then(m => m.TechCompanyDashboardComponent),
    canActivate: [authGuard, techCompanyGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () => import('./components/tech-company-dashboard/components/main/main.component').then(m => m.MainComponent),
        title: 'Tech Company Dashboard'
      },
      
      // Product Management
      {
        path: 'products',
        loadComponent: () => import('./components/tech-company-dashboard/components/my-products/my-products.component').then(m => m.MyProductsComponent),
        title: 'My Products'
      },
      {
        path: 'create-product',
        loadComponent: () => import('./components/tech-company-dashboard/components/create-product/create-product.component').then(m => m.CreateProductComponent),
        title: 'Create Product'
      },
      {
        path: 'edit-product/:id',
        loadComponent: () => import('./components/tech-company-dashboard/pages/edit-product/edit-product.component').then(m => m.EditProductComponent),
        title: 'Edit Product'
      },
      
      // Service Management
      {
        path: 'maintenance-requests',
        loadComponent: () => import('./components/tech-company-dashboard/pages/maintenance-requests/maintenance-requests.component').then(m => m.MaintenanceRequestsComponent),
        title: 'Maintenance Requests'
      },
      {
        path: 'pc-assemblies',
        loadComponent: () => import('./components/tech-company-dashboard/pages/pc-assemblies/pc-assemblies.component').then(m => m.PcAssembliesComponent),
        title: 'PC Assembly Requests'
      },
      
      // Commission & Earnings
      {
        path: 'commissions',
        loadComponent: () => import('./components/tech-company-dashboard/pages/commissions/commissions.component').then(m => m.CommissionsComponent),
        title: 'My Commissions'
      },
      {
        path: 'earnings',
        loadComponent: () => import('./components/tech-company-dashboard/pages/earnings/earnings.component').then(m => m.EarningsComponent),
        title: 'Earnings Report'
      },
      
      // Profile & Settings
      {
        path: 'profile',
        loadComponent: () => import('./components/tech-company-dashboard/pages/profile/profile.component').then(m => m.ProfileComponent),
        title: 'Company Profile'
      },
      {
        path: 'profile-settings',
        loadComponent: () => import('./components/profile-settings/profile-settings.component').then(m => m.CustomerProfileSettingsComponent),
        title: 'Profile Settings'
      },
      {
        path: 'settings',
        loadComponent: () => import('./components/tech-company-dashboard/pages/settings/settings.component').then(m => m.SettingsComponent),
        title: 'Settings'
      }
    ]
  },

  // Delivery Person Dashboard Routes - Comprehensive
  {
    path: 'delivery',
    canActivate: [authGuard, deliveryGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/delivery-dashboard/delivery-dashboard.component').then(m => m.DeliveryDashboardComponent),
        title: 'Delivery Dashboard'
      },
      
      // Delivery Management
      {
        path: 'active-deliveries',
        loadComponent: () => import('./components/delivery-dashboard/pages/active-deliveries/active-deliveries.component').then(m => m.ActiveDeliveriesComponent),
        title: 'Active Deliveries'
      },
      {
        path: 'delivery-history',
        loadComponent: () => import('./components/delivery-dashboard/pages/delivery-history/delivery-history.component').then(m => m.DeliveryHistoryComponent),
        title: 'Delivery History'
      },
      {
        path: 'delivery-details/:id',
        loadComponent: () => import('./components/delivery-dashboard/pages/delivery-details/delivery-details.component').then(m => m.DeliveryDetailsComponent),
        title: 'Delivery Details'
      },
      
      // Earnings & Performance
      {
        path: 'earnings',
        loadComponent: () => import('./components/delivery-dashboard/pages/earnings/earnings.component').then(m => m.EarningsComponent),
        title: 'My Earnings'
      },
      {
        path: 'performance',
        loadComponent: () => import('./components/delivery-dashboard/pages/performance/performance.component').then(m => m.PerformanceComponent),
        title: 'Performance Stats'
      },
      
      // Profile & Settings
      {
        path: 'profile',
        loadComponent: () => import('./components/delivery-dashboard/pages/profile/profile.component').then(m => m.ProfileComponent),
        title: 'Profile'
      },
      {
        path: 'profile-settings',
        loadComponent: () => import('./components/profile-settings/profile-settings.component').then(m => m.CustomerProfileSettingsComponent),
        title: 'Profile Settings'
      },
      {
        path: 'settings',
        loadComponent: () => import('./components/delivery-dashboard/pages/settings/settings.component').then(m => m.SettingsComponent),
        title: 'Settings'
      }
    ]
  },

  // Customer Dashboard Routes - Comprehensive
  {
    path: 'customer',
    canActivate: [authGuard, customerGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent),
        title: 'Customer Dashboard'
      },
      
      // Orders
      {
        path: 'orders',
        loadComponent: () => import('./components/customer-dashboard/pages/orders/orders.component').then(m => m.OrdersComponent),
        title: 'My Orders'
      },
      {
        path: 'order-details/:id',
        loadComponent: () => import('./components/customer-dashboard/pages/order-details/order-details.component').then(m => m.OrderDetailsComponent),
        title: 'Order Details'
      },
      {
        path: 'order-history',
        loadComponent: () => import('./components/customer-dashboard/pages/order-history/order-history.component').then(m => m.OrderHistoryComponent),
        title: 'Order History'
      },
      
      // Services
      {
        path: 'maintenance-requests',
        loadComponent: () => import('./components/customer-dashboard/pages/maintenance-requests/maintenance-requests.component').then(m => m.MaintenanceRequestsComponent),
        title: 'Maintenance Requests'
      },
      {
        path: 'create-maintenance',
        loadComponent: () => import('./components/customer-dashboard/pages/create-maintenance/create-maintenance.component').then(m => m.CreateMaintenanceComponent),
        title: 'Create Maintenance Request'
      },
      {
        path: 'pc-assemblies',
        loadComponent: () => import('./components/customer-dashboard/pages/pc-assemblies/pc-assemblies.component').then(m => m.PcAssembliesComponent),
        title: 'PC Assemblies'
      },
      {
        path: 'create-pc-assembly',
        loadComponent: () => import('./components/customer-dashboard/pages/create-pc-assembly/create-pc-assembly.component').then(m => m.CreatePcAssemblyComponent),
        title: 'Create PC Assembly'
      },
      
      // Shopping
      {
        path: 'wishlist',
        loadComponent: () => import('./components/customer-dashboard/pages/wishlist/wishlist.component').then(m => m.WishlistComponent),
        title: 'My Wishlist'
      },
      {
        path: 'cart',
        loadComponent: () => import('./components/customer-dashboard/pages/cart/cart.component').then(m => m.CartComponent),
        title: 'My Cart'
      },
      
      // Profile & Settings
      {
        path: 'profile',
        loadComponent: () => import('./components/customer-dashboard/pages/profile/profile.component').then(m => m.ProfileComponent),
        title: 'Profile'
      },
      {
        path: 'profile-settings',
        loadComponent: () => import('./components/profile-settings/profile-settings.component').then(m => m.CustomerProfileSettingsComponent),
        title: 'Profile Settings'
      },
      {
        path: 'settings',
        loadComponent: () => import('./components/customer-dashboard/pages/settings/settings.component').then(m => m.SettingsComponent),
        title: 'Settings'
      },
      {
        path: 'notifications',
        loadComponent: () => import('./components/customer-dashboard/pages/notifications/notifications.component').then(m => m.NotificationsComponent),
        title: 'Notifications'
      }
    ]
  },

  // Public Service Pages
  {
    path: 'services',
    children: [
      {
        path: 'maintenance',
        loadComponent: () => import('./components/services/maintenance/maintenance.component').then(m => m.MaintenanceComponent),
        title: 'Maintenance Services'
      },
      {
        path: 'pc-assembly',
        loadComponent: () => import('./components/services/pc-assembly/pc-assembly.component').then(m => m.PcAssemblyComponent),
        title: 'PC Assembly Services'
      },
      {
        path: 'delivery',
        loadComponent: () => import('./components/services/delivery/delivery.component').then(m => m.DeliveryComponent),
        title: 'Delivery Services'
      }
    ]
  },
  {path: 'profiles', loadComponent: () => import('./components/GeneralProfile/MainPages/profile-list/profile-list.component').then(m => m.ProfileListComponent), title: 'Profiles'},
  {path: 'profile-details/:id', loadComponent: () => import('./components/GeneralProfile/MainPages/profile-details/profile-details.component').then(m => m.ProfileDetailsComponent), title: 'Profile Details'},

  // Error Routes
  { path: 'unauthorized', loadComponent: () => import('./components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent), title: 'Unauthorized' },
  { path: '**', redirectTo: 'home' }
];