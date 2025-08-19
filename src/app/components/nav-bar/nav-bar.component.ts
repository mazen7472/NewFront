import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, HostListener, inject, OnInit, PLATFORM_ID, OnDestroy, ElementRef, ViewChild } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { AuthService } from "../../Services/auth.service";
import { CartService } from "../../Services/cart.service";
import { WishlistService } from "../../Services/wishlist.service";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ImageUtilityService } from "../../Services/image-utility.service";
import { ToastrService } from "ngx-toastr";
import { NotificationService } from "../../Services/notification.service";
import { NotificationDTO } from "../../Interfaces/inotification";
import { Environment } from "../../Environment/environment";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent implements OnInit, OnDestroy {
  isLogedIn = false;
  isDarkMode = false;
  scrolled = false;
  dropdownOpen = false;
  notifications: NotificationDTO[] = [];
  logo = 'assets/Images/logo.png';

  cartItemCount$!: Observable<number>;
  cartTotalPrice$!: Observable<number>;
  animateCart$!: Observable<boolean>;
  cartCount = 0;
  cartUpdated = false;

  wishlistItemCount$!: Observable<number>;
  wishlistCount = 0;
  wishlistUpdated = false;

  userName: string | null = null;
  profilePhotoUrl: string = 'assets/Images/default-profile.jpg';
  userId: string | null = null;

  @ViewChild('notificationDropdown') notificationDropdown!: ElementRef;

  private _platformId = inject(PLATFORM_ID);
  private _isBrowser = isPlatformBrowser(this._platformId);
  public _authService = inject(AuthService);
  public _imageUtilityService = inject(ImageUtilityService);
  private subscriptions: Subscription[] = [];

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toaster: ToastrService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    console.log(this.cartTotalPrice$);

    this.loadNotifications();
    // Initialize states
    this.cartService.initializeCartState();
    this.wishlistService.initializeWishlistState();
    this._authService.initialize();

    // Initialize theme from localStorage
    if (this._isBrowser) {
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode = savedTheme === 'dark';
      this.applyTheme();
    }

    // Observables
    this.cartItemCount$ = this.cartService.itemCount$;
    this.cartTotalPrice$ = this.cartService.totalPrice$;    
    this.animateCart$ = this.cartService.animateCart$;
    this.wishlistItemCount$ = this.wishlistService.itemCount$;

    if (this._isBrowser) {
      // Auth
      this.subscriptions.push(
        this._authService.isLoggedIn$.subscribe(status => {
          this.isLogedIn = status;
          if (status) {
            this.loadProfilePhoto();
          } else {
            this.profilePhotoUrl = 'assets/Images/default-profile.jpg';
          }
        })
      );

      this.subscriptions.push(
        this._authService.userName$.subscribe(name => {
          this.userName = name;
        })
      );

      this.subscriptions.push(
  this.cartService.getCart().subscribe(response => {
    if (response.success && response.data) {
      const newCount = response.data.cartItems.reduce((sum, i) => sum + i.quantity, 0);
      if (newCount !== this.cartCount) {
        this.cartCount = newCount;
        this.triggerCartAnimation();
      }
    } else {
      // No data or failure — reset count if needed
      if (this.cartCount !== 0) {
        this.cartCount = 0;
      }
    }
  })
);


      // Wishlist count
      this.subscriptions.push(
        this.wishlistService.getLoggedWishList().subscribe(res => {
          const newCount = res.data?.items?.length || 0;
          if (newCount !== this.wishlistCount) {
            this.wishlistCount = newCount;
            this.triggerWishlistAnimation();
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  triggerCartAnimation() {
    this.cartUpdated = true;
    setTimeout(() => this.cartUpdated = false, 400);
  }

  triggerWishlistAnimation() {
    this.wishlistUpdated = true;
    setTimeout(() => this.wishlistUpdated = false, 400);
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    
    // Save theme preference
    if (this._isBrowser) {
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }
  }

  private applyTheme(): void {
    if (this._isBrowser) {
      // Use requestAnimationFrame for smooth transitions
      requestAnimationFrame(() => {
        document.body.classList.toggle('dark-mode', this.isDarkMode);
        document.body.classList.toggle('light-theme', !this.isDarkMode);
        document.body.classList.toggle('dark-theme', this.isDarkMode);
        
        // Add transition class for smooth animation
        document.body.classList.add('theme-transition');
        setTimeout(() => {
          document.body.classList.remove('theme-transition');
        }, 300);
      });
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled = window.scrollY > 20;
  }

  get navbarClasses(): Record<string, boolean> {
    return {
      'custom-navbar': true,
      'navbar-scrolled': this.scrolled,
      'dark-mode': this.isDarkMode,
    };
  }

  get linkClass(): string {
    return this.isDarkMode ? 'text-dark' : 'text-white';
  }

  get logoClass(): string {
    return this.isDarkMode ? 'text-dark' : 'text-white';
  }

  get themeIcon(): string {
    return this.isDarkMode ? 'bi-moon-fill' : 'bi-sun-fill';
  }

  logout(): void {
    this._authService.logOut();
  }

  loadProfilePhoto(): void {
    if (!this._isBrowser) return;

    const storedPhotoPath = localStorage.getItem('profilePhotoUrl');

    if (storedPhotoPath) {
      const apiBaseUrl = Environment.baseImageUrl.replace(/\/+$/, '');
      const cleanedPath = storedPhotoPath.replace(/^\/+/, '');
      this.profilePhotoUrl = `${apiBaseUrl}/${cleanedPath}`;
    } else {
      this.profilePhotoUrl = 'assets/Images/default-profile.jpg';
    }
  }

  onImageError(event: Event): void {
  const img = event.target;
  if (img instanceof HTMLImageElement) {
    img.src = 'assets/Images/default-profile.jpg';
  }
}

loadNotifications() {
    this.notificationService.getMyNotifications(1, 20).subscribe({
      next: (res) => {
        this.notifications = res ?? [];
      },
      error: (err) => {
        console.log(err);
        // this.toaster.error('Failed to load notifications');
      },
    });
  }

get unreadCount(): number {
  return this.notifications.filter(n => !n.isRead).length;
}

toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;

  if (this.dropdownOpen) {
    // When dropdown opens, wait 1 second then mark all unread notifications as read
    setTimeout(() => {
      const unreadNotifications = this.notifications.filter(n => !n.isRead);
      unreadNotifications.forEach(notification => {
        this.markAsRead(notification.id);
      });
    }, 2000);
  }
}


closeDropdown() {
  // close dropdown on blur (when user clicks outside)
  this.dropdownOpen = false;
}

// markAsRead method from your current component
markAsRead(notificationId: string) {
  this.notificationService.markAsRead(notificationId).subscribe({
    next: () => {
      const notif = this.notifications.find((n) => n.id === notificationId);
      if (notif) notif.isRead = true;
    },
    error: () => {
      this.toaster.error('Failed to mark notification as read.');
    },
  });
}

trackById(index: number, item: NotificationDTO): string {
  return item.id;
}

@HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      this.dropdownOpen &&
      this.notificationDropdown &&
      !this.notificationDropdown.nativeElement.contains(event.target)
    ) {
      this.dropdownOpen = false;
    }
  }

}