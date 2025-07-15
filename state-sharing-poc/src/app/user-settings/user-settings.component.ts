import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStateService, User } from '../services/user-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  
  user: User | null = null;
  private subscriptions: Subscription[] = [];

  constructor(private userStateService: UserStateService) {}

  ngOnInit() {
    const userSubscription = this.userStateService.user$.subscribe(user => {
      this.user = user;
    });
    
    this.subscriptions.push(userSubscription);
    this.userStateService.logActivity('User settings component loaded', 'UserSettingsComponent');
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleTheme() {
    const newTheme = this.user?.preferences.theme === 'light' ? 'dark' : 'light';
    this.userStateService.updatePreferences({ theme: newTheme });
  }

  toggleNotifications() {
    const newNotifications = !this.user?.preferences.notifications;
    this.userStateService.updatePreferences({ notifications: newNotifications });
  }

  changeLanguage(language: string) {
    this.userStateService.updatePreferences({ language });
  }
}
