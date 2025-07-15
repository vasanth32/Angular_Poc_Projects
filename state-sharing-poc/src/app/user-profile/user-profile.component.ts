import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserStateService, User, UserActivity } from '../services/user-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  
  // State variables
  user: User | null = null;
  activity: UserActivity[] = [];
  
  // Form variables
  editMode = false;
  editForm = {
    name: '',
    email: '',
    avatar: ''
  };
  
  // Available avatars
  avatars = ['👤', '👨', '👩', '🧑', '👨‍💻', '👩‍💻', '🧑‍💼', '👨‍🎨', '👩‍🎨'];
  
  // Subscriptions for cleanup
  private subscriptions: Subscription[] = [];

  constructor(private userStateService: UserStateService) {}

  ngOnInit() {
    // Subscribe to user state changes
    const userSubscription = this.userStateService.user$.subscribe(user => {
      this.user = user;
      // Initialize form with current user data
      if (user) {
        this.editForm = {
          name: user.name,
          email: user.email,
          avatar: user.avatar
        };
      }
    });
    
    // Subscribe to activity changes
    const activitySubscription = this.userStateService.activity$.subscribe(activity => {
      this.activity = activity;
    });
    
    this.subscriptions.push(userSubscription, activitySubscription);
    
    // Log component load
    this.userStateService.logActivity('User profile component loaded', 'UserProfileComponent');
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Toggle edit mode
  toggleEditMode() {
    this.editMode = !this.editMode;
    
    if (this.editMode) {
      // Reset form to current user data when entering edit mode
      if (this.user) {
        this.editForm = {
          name: this.user.name,
          email: this.user.email,
          avatar: this.user.avatar
        };
      }
      this.userStateService.logActivity('Entered edit mode', 'UserProfileComponent');
    } else {
      this.userStateService.logActivity('Exited edit mode', 'UserProfileComponent');
    }
  }

  // Save profile changes
  saveProfile() {
    if (this.user) {
      const updates: Partial<User> = {
        name: this.editForm.name,
        email: this.editForm.email,
        avatar: this.editForm.avatar
      };
      
      this.userStateService.updateUser(updates);
      this.editMode = false;
      this.userStateService.logActivity('Profile updated', 'UserProfileComponent');
    }
  }

  // Cancel edit
  cancelEdit() {
    this.editMode = false;
    // Reset form to current user data
    if (this.user) {
      this.editForm = {
        name: this.user.name,
        email: this.user.email,
        avatar: this.user.avatar
      };
    }
    this.userStateService.logActivity('Edit cancelled', 'UserProfileComponent');
  }

  // Select avatar
  selectAvatar(avatar: string) {
    this.editForm.avatar = avatar;
    this.userStateService.logActivity(`Avatar selected: ${avatar}`, 'UserProfileComponent');
  }

  // Toggle login status
  toggleLoginStatus() {
    if (this.user?.isLoggedIn) {
      this.userStateService.logout();
    } else {
      this.userStateService.login(this.user?.name || '', this.user?.email || '');
    }
  }

  // Reset user state
  resetUserState() {
    this.userStateService.resetUserState();
    this.editMode = false;
    this.userStateService.logActivity('User state reset', 'UserProfileComponent');
  }

  // Format date for display
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  }

  // Get activity count for different time periods
  getActivityStats() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return {
      total: this.activity.length,
      lastHour: this.activity.filter(a => a.timestamp > oneHourAgo).length,
      lastDay: this.activity.filter(a => a.timestamp > oneDayAgo).length
    };
  }

  // Get activities by component
  getActivitiesByComponent() {
    const componentCounts: { [key: string]: number } = {};
    
    this.activity.forEach(activity => {
      componentCounts[activity.component] = (componentCounts[activity.component] || 0) + 1;
    });
    
    return Object.entries(componentCounts)
      .map(([component, count]) => ({ component, count }))
      .sort((a, b) => b.count - a.count);
  }

  // Clear activity log
  clearActivity() {
    // Note: This would require a method in the service
    this.userStateService.logActivity('Activity log cleared', 'UserProfileComponent');
  }
}
