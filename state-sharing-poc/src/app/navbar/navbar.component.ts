import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStateService, User } from '../services/user-state.service';
import { CartStateService, CartState } from '../services/cart-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  
  // State variables
  user: User | null = null;
  cartSummary: {items: number, total: number, isEmpty: boolean} | null = null;
  
  // Subscriptions for cleanup
  private subscriptions: Subscription[] = [];

  constructor(
    private userStateService: UserStateService,
    private cartStateService: CartStateService
  ) {}

  ngOnInit() {
    // Subscribe to user state changes
    const userSubscription = this.userStateService.user$.subscribe(user => {
      this.user = user;
      this.userStateService.logActivity('Navbar updated with user info', 'NavbarComponent');
    });

    // Subscribe to cart summary changes
    const cartSubscription = this.cartStateService.getCartSummary().subscribe(summary => {
      this.cartSummary = summary;
      this.userStateService.logActivity('Navbar updated with cart summary', 'NavbarComponent');
    });

    // Store subscriptions for cleanup
    this.subscriptions.push(userSubscription, cartSubscription);
  }

  ngOnDestroy() {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Toggle user theme
  toggleTheme() {
    const currentTheme = this.user?.preferences.theme || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    this.userStateService.updatePreferences({ theme: newTheme });
    this.userStateService.logActivity(`Theme changed to ${newTheme}`, 'NavbarComponent');
  }

  // Toggle notifications
  toggleNotifications() {
    const currentNotifications = this.user?.preferences.notifications || false;
    this.userStateService.updatePreferences({ notifications: !currentNotifications });
    this.userStateService.logActivity(`Notifications ${!currentNotifications ? 'enabled' : 'disabled'}`, 'NavbarComponent');
  }

  // Logout user
  logout() {
    this.userStateService.logout();
    this.userStateService.logActivity('User logged out from navbar', 'NavbarComponent');
  }

  // Clear cart
  clearCart() {
    this.cartStateService.clearCart();
    this.userStateService.logActivity('Cart cleared from navbar', 'NavbarComponent');
  }
}
