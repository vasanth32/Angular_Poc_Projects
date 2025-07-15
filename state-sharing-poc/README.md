# POC 15: State Sharing Using Singleton Services

## 🎯 Overview

This POC demonstrates **state sharing using singleton services** in Angular 19 with standalone components. It showcases how to manage application state across multiple components using the singleton pattern with RxJS Observables.

## 🏗️ Architecture

### Core Components
- **UserStateService**: Manages user information, preferences, and activity logging
- **CartStateService**: Manages shopping cart state and product data
- **NavbarComponent**: Displays real-time user and cart information
- **UserProfileComponent**: Manages user profile editing and activity tracking
- **UserSettingsComponent**: Handles user preferences configuration
- **ShoppingCartComponent**: Manages product catalog and shopping cart operations

### State Flow
```
Singleton Services (providedIn: 'root')
       ↓
BehaviorSubject + Observable
       ↓
Multiple Components Subscribe
       ↓
Real-time Updates Across All Components
```

## 🔑 Key Concepts Learned

### 1. **Singleton Pattern in Angular**
```typescript
@Injectable({
  providedIn: 'root' // Creates singleton instance
})
export class UserStateService {
  // Single instance shared across entire application
}
```

### 2. **BehaviorSubject for State Management**
```typescript
private userSubject = new BehaviorSubject<User>(initialUser);
public user$: Observable<User> = this.userSubject.asObservable();

// Update state
updateUser(user: Partial<User>) {
  const currentUser = this.userSubject.value;
  const updatedUser = { ...currentUser, ...user };
  this.userSubject.next(updatedUser);
}
```

### 3. **Component State Subscription**
```typescript
ngOnInit() {
  this.userStateService.user$.subscribe(user => {
    this.user = user; // Automatic updates
  });
}
```

### 4. **Memory Management**
```typescript
private subscriptions: Subscription[] = [];

ngOnDestroy() {
  this.subscriptions.forEach(sub => sub.unsubscribe());
}
```

## 🛠️ Implementation Details

### Service Architecture
- **UserStateService**: User data, preferences, activity tracking
- **CartStateService**: Shopping cart, products, totals calculation
- **Real-time logging**: All interactions tracked across components

### Component Communication
- **Reactive Updates**: Changes in one component instantly reflect in others
- **Centralized State**: Single source of truth for application state
- **Type Safety**: Full TypeScript interfaces for all state objects

### Advanced Features
- **Derived Observables**: Calculate totals, counts, and summaries
- **Activity Logging**: Track user interactions across components
- **Theme Management**: Dynamic theme switching with real-time updates
- **Cart Management**: Add/remove items with automatic total calculation

## 📋 Exercise: Extend the State Management

### Task: Add Notification System
Create a notification service that shows toast messages for user actions.

#### Step 1: Create NotificationService
```typescript
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  showNotification(type: string, message: string) {
    // Implement notification logic
  }
}
```

#### Step 2: Integrate with Existing Services
```typescript
// In UserStateService
constructor(private notificationService: NotificationService) {}

updateUser(user: Partial<User>) {
  // ... existing code ...
  this.notificationService.showNotification('success', 'Profile updated!');
}
```

#### Step 3: Create Notification Component
Display notifications in a toast-style overlay.

#### Step 4: Add to App Component
Include notification component in the main app template.

## 🤔 Interview Questions & Answers

### Q1: What is the singleton pattern and how does Angular implement it?
**Answer**: 
The singleton pattern ensures only one instance of a class exists throughout the application. Angular implements this using:
- `@Injectable({ providedIn: 'root' })` - Creates single instance in root injector
- Dependency injection system manages instance lifecycle
- All components receive the same service instance

### Q2: What's the difference between BehaviorSubject and Subject?
**Answer**:
- **BehaviorSubject**: Stores current value, emits last value to new subscribers
- **Subject**: No initial value, only emits to subscribers after subscription
- **BehaviorSubject** is ideal for state management because components get current state immediately

### Q3: How do you prevent memory leaks in Angular services?
**Answer**:
```typescript
// Store subscriptions
private subscriptions: Subscription[] = [];

// Unsubscribe in ngOnDestroy
ngOnDestroy() {
  this.subscriptions.forEach(sub => sub.unsubscribe());
}

// Or use takeUntil pattern
private destroy$ = new Subject<void>();

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

### Q4: When should you use singleton services vs component state?
**Answer**:
- **Singleton Services**: Cross-component data, user session, global settings
- **Component State**: UI-specific data, form inputs, component-specific logic
- **Services**: Data persistence, API calls, business logic

### Q5: How does Angular's dependency injection work with singleton services?
**Answer**:
- Root injector creates single instance when `providedIn: 'root'`
- All components requesting service get same instance
- Injector hierarchy ensures proper scoping
- Services can inject other services creating dependency graph

### Q6: What are the benefits of reactive state management?
**Answer**:
- **Predictable**: Single source of truth
- **Reactive**: Automatic UI updates
- **Scalable**: Easy to extend and maintain
- **Testable**: Services can be easily mocked
- **Performant**: Only updates when state changes

### Q7: How do you handle complex state updates?
**Answer**:
```typescript
// Use immutable updates
updateUser(updates: Partial<User>) {
  const current = this.userSubject.value;
  const updated = { 
    ...current, 
    ...updates,
    preferences: { ...current.preferences, ...updates.preferences }
  };
  this.userSubject.next(updated);
}
```

### Q8: What's the difference between this approach and NgRx?
**Answer**:
- **Singleton Services**: Simpler, less boilerplate, good for small-medium apps
- **NgRx**: More structure, time-travel debugging, better for large applications
- **Both**: Use reactive patterns, immutable updates, centralized state

## 🎮 Demo Features

### Interactive Elements
1. **Theme Toggle**: Switch between light/dark themes
2. **Cart Management**: Add/remove products, see real-time totals
3. **Profile Editing**: Update user information with live validation
4. **Activity Tracking**: Monitor all user interactions
5. **Preference Management**: Configure app settings

### Real-time Updates
- Navbar shows current user and cart status
- All components reflect changes immediately
- Activity log tracks cross-component interactions
- Theme changes apply globally

## 🚀 Running the Application

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Open browser to
http://localhost:4200
```

## 📁 Project Structure

```
src/app/
├── services/
│   ├── user-state.service.ts     # User state management
│   └── cart-state.service.ts     # Cart state management
├── components/
│   ├── navbar/                   # Global navigation
│   ├── user-profile/             # User profile management
│   ├── user-settings/            # Settings configuration
│   └── shopping-cart/            # Cart management
├── interfaces/                   # TypeScript interfaces
└── app.component.*               # Main app component
```

## 🔍 Learning Outcomes

After completing this POC, you'll understand:
- How to implement singleton pattern in Angular
- State management using BehaviorSubject and Observable
- Cross-component communication strategies
- Memory management and subscription cleanup
- Real-time reactive updates
- TypeScript interfaces for type safety
- Service architecture and dependency injection

## 🎯 Best Practices Demonstrated

1. **Single Responsibility**: Each service handles specific domain
2. **Immutable Updates**: State changes don't mutate existing objects
3. **Type Safety**: Strong typing for all state objects
4. **Memory Management**: Proper subscription cleanup
5. **Reactive Programming**: Observable patterns throughout
6. **Component Communication**: Loose coupling via services

## 🤝 Contributing

Feel free to extend this POC with:
- Additional state management patterns
- More complex business logic
- Integration with external APIs
- Advanced RxJS operators
- Performance optimizations

---

**Built with Angular 19 • TypeScript • RxJS • Standalone Components**
