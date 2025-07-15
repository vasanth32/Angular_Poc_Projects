import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
  isLoggedIn: boolean;
}

export interface UserActivity {
  timestamp: Date;
  action: string;
  component: string;
}

@Injectable({
  providedIn: 'root' // This makes it a singleton service
})
export class UserStateService {
  
  // Private BehaviorSubject to hold the current state
  private userSubject = new BehaviorSubject<User>({
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '👤',
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'en'
    },
    isLoggedIn: true
  });

  // Private activity log subject
  private activitySubject = new BehaviorSubject<UserActivity[]>([]);

  // Public observable for components to subscribe to
  public user$: Observable<User> = this.userSubject.asObservable();
  public activity$: Observable<UserActivity[]> = this.activitySubject.asObservable();

  // Getter for current user value (synchronous)
  get currentUser(): User {
    return this.userSubject.value;
  }

  // Getter for current activity log
  get currentActivity(): UserActivity[] {
    return this.activitySubject.value;
  }

  // Update user information
  updateUser(userUpdate: Partial<User>) {
    const currentUser = this.userSubject.value;
    const updatedUser = { ...currentUser, ...userUpdate };
    this.userSubject.next(updatedUser);
    
    this.logActivity('User updated', 'UserStateService');
  }

  // Update user preferences
  updatePreferences(preferences: Partial<User['preferences']>) {
    const currentUser = this.userSubject.value;
    const updatedUser = {
      ...currentUser,
      preferences: { ...currentUser.preferences, ...preferences }
    };
    this.userSubject.next(updatedUser);
    
    this.logActivity(`Preferences updated: ${Object.keys(preferences).join(', ')}`, 'UserStateService');
  }

  // Login user
  login(name: string, email: string) {
    const currentUser = this.userSubject.value;
    const updatedUser = {
      ...currentUser,
      name,
      email,
      isLoggedIn: true
    };
    this.userSubject.next(updatedUser);
    
    this.logActivity('User logged in', 'UserStateService');
  }

  // Logout user
  logout() {
    const currentUser = this.userSubject.value;
    const updatedUser = {
      ...currentUser,
      isLoggedIn: false
    };
    this.userSubject.next(updatedUser);
    
    this.logActivity('User logged out', 'UserStateService');
  }

  // Log activity
  logActivity(action: string, component: string) {
    const currentActivity = this.activitySubject.value;
    const newActivity: UserActivity = {
      timestamp: new Date(),
      action,
      component
    };
    
    // Keep only last 10 activities
    const updatedActivity = [newActivity, ...currentActivity].slice(0, 10);
    this.activitySubject.next(updatedActivity);
  }

  // Reset user state
  resetUserState() {
    this.userSubject.next({
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '👤',
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en'
      },
      isLoggedIn: true
    });
    
    this.activitySubject.next([]);
    this.logActivity('User state reset', 'UserStateService');
  }
}
