import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    NavbarComponent,
    UserProfileComponent,
    UserSettingsComponent,
    ShoppingCartComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'State Sharing POC';
  currentView = 'home';
  
  // Navigation options
  navItems = [
    { id: 'home', label: '🏠 Home', description: 'Overview of State Sharing' },
    { id: 'profile', label: '👤 Profile', description: 'User Profile Management' },
    { id: 'settings', label: '⚙️ Settings', description: 'User Preferences' },
    { id: 'cart', label: '🛒 Shopping Cart', description: 'Shopping Cart Demo' }
  ];
  
  // Set current view
  setView(view: string) {
    this.currentView = view;
  }
}
