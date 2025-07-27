# 🛒 Signal-based Shopping Cart Badge POC

> **Angular 20 • Signals API • Standalone Components • Real-time Reactivity**

A demonstration of Angular 20's powerful Signals API for building reactive shopping cart functionality without RxJS.

## 🎯 What This POC Demonstrates

- **Angular Signals**: Real-time reactivity without RxJS
- **Shopping Cart Badge**: Live updates in navbar
- **Standalone Components**: Modern Angular architecture
- **Service Pattern**: Centralized state management
- **Reactive UI**: Instant UI updates on state changes

## 🚀 Live Demo

Visit `http://localhost:4200` to see the live cart badge in action!

## 📁 Project Structure

```
src/
├── app/
│   ├── app.component.ts          # Main app layout with navbar + router
│   ├── app.config.ts             # App configuration
│   ├── app.routes.ts             # Routing configuration
│   ├── cart.service.ts           # 🧠 Signal-based cart service
│   ├── navbar.component.ts       # 🎯 Cart badge component
│   └── products.component.ts     # 🛍️ Add/remove items interface
├── main.ts                       # App bootstrap
└── styles.css                    # Global styles
```

## 🧠 Signal Concepts Explained

### 1. What are Angular Signals?

Signals are Angular's new reactive primitive that provides:
- **Fine-grained reactivity**: Only affected components re-render
- **Automatic dependency tracking**: No manual subscription management
- **Better performance**: More efficient than RxJS for simple state
- **Simpler syntax**: Less boilerplate code

### 2. Signal Types in Our POC

#### 📊 **Writable Signal** (`signal<number>`)
```typescript
// In cart.service.ts
private itemCount = signal(0);  // Writable signal with initial value 0
```

#### 🔒 **Readonly Signal** (`Signal<number>`)
```typescript
// In cart.service.ts
get cartCount() {
  return this.itemCount.asReadonly();  // Expose as readonly to components
}
```

### 3. Signal Operations

#### ➕ **Update Signal Value**
```typescript
// Add item to cart
addItem() {
  this.itemCount.update(count => count + 1);  // Functional update
}
```

#### ➖ **Remove Item with Validation**
```typescript
// Remove item (prevents negative values)
removeItem() {
  this.itemCount.update(count => Math.max(0, count - 1));
}
```

### 4. Signal Consumption in Components

#### 🎯 **Direct Signal Usage**
```typescript
// In navbar.component.ts
cartCount: Signal<number> = this.cartService.cartCount;

// In template
<span class="badge">{{ cartCount() }}</span>  // Call signal as function
```

#### 🔄 **Automatic Reactivity**
- When `itemCount` signal changes → `cartCount()` automatically updates
- Component template re-renders only the affected part
- No manual subscription/unsubscription needed

## 🛠️ Implementation Details

### CartService (`cart.service.ts`)

```typescript
@Injectable({ providedIn: 'root' })
export class CartService {
  // Private writable signal
  private itemCount = signal(0);

  // Public readonly signal
  get cartCount() {
    return this.itemCount.asReadonly();
  }

  // Methods to update signal
  addItem() {
    this.itemCount.update(count => count + 1);
  }

  removeItem() {
    this.itemCount.update(count => Math.max(0, count - 1));
  }
}
```

**Key Points:**
- `signal(0)` creates a writable signal with initial value 0
- `asReadonly()` prevents external modification
- `update()` method for functional state updates

### NavbarComponent (`navbar.component.ts`)

```typescript
export class NavbarComponent {
  private cartService = inject(CartService);
  cartCount: Signal<number> = this.cartService.cartCount;
}
```

**Key Points:**
- `inject()` for dependency injection
- Signal is consumed directly in template with `cartCount()`
- Badge automatically updates when signal changes

### ProductsComponent (`products.component.ts`)

```typescript
export class ProductsComponent {
  cart = inject(CartService);

  addToCart() {
    this.cart.addItem();  // Updates signal
  }

  removeFromCart() {
    this.cart.removeItem();  // Updates signal
  }
}
```

**Key Points:**
- Buttons trigger signal updates
- UI automatically reflects changes
- No manual state management needed

## 🎨 UI Features

### Responsive Design
- **Gradient Backgrounds**: Modern visual appeal
- **Hover Effects**: Interactive button animations
- **Badge Visibility**: Hides when cart is empty
- **Mobile-Friendly**: Works on all screen sizes

### Real-time Updates
- **Instant Badge Updates**: No loading states
- **Smooth Animations**: CSS transitions
- **Visual Feedback**: Button hover effects

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Angular CLI 20+

### Installation
```bash
# Clone or navigate to project
cd cart-signal-poc

# Install dependencies
npm install

# Start development server
ng serve

# Open browser
http://localhost:4200
```

### Usage
1. **Add Items**: Click "Add Item to Cart" button
2. **Remove Items**: Click "Remove Item" button  
3. **Watch Badge**: See real-time updates in navbar
4. **Test Reactivity**: Notice instant UI updates

## 🔍 Signal vs RxJS Comparison

| Feature | Signals | RxJS |
|---------|---------|------|
| **Syntax** | `signal(0)` | `new BehaviorSubject(0)` |
| **Updates** | `update(count => count + 1)` | `next(value)` |
| **Consumption** | `signal()` | `subscribe()` |
| **Cleanup** | Automatic | Manual unsubscribe |
| **Performance** | Fine-grained | Coarse-grained |
| **Learning Curve** | Simple | Complex |

## 🎯 Key Benefits of Signals

### 1. **Simpler Code**
```typescript
// Signals (Simple)
const count = signal(0);
count.update(n => n + 1);

// RxJS (Complex)
const count$ = new BehaviorSubject(0);
count$.next(count$.value + 1);
```

### 2. **Automatic Cleanup**
```typescript
// Signals - No cleanup needed
cartCount: Signal<number> = this.cartService.cartCount;

// RxJS - Manual cleanup required
ngOnDestroy() {
  this.subscription.unsubscribe();
}
```

### 3. **Better Performance**
- Only affected components re-render
- No unnecessary change detection cycles
- More efficient than RxJS for simple state

## 🧪 Testing the POC

### Manual Testing
1. **Add Items**: Click add button multiple times
2. **Remove Items**: Click remove button to decrease count
3. **Edge Cases**: Try removing when count is 0
4. **Real-time**: Watch badge update instantly

### Expected Behavior
- ✅ Badge shows current cart count
- ✅ Badge hides when count is 0
- ✅ Add button increases count
- ✅ Remove button decreases count (min 0)
- ✅ Updates are instant and smooth

## 🔮 Future Enhancements

### Possible Extensions
- **Cart Items**: Store actual product objects
- **Local Storage**: Persist cart state
- **Multiple Products**: Different item types
- **Cart Page**: Detailed cart view
- **Animations**: Smooth badge transitions

### Signal Advanced Features
- **Computed Signals**: Derived state
- **Effect**: Side effects on signal changes
- **Signal Arrays**: Complex state management

## 📚 Learning Resources

- [Angular Signals Documentation](https://angular.dev/guide/signals)
- [Angular 20 Release Notes](https://blog.angular.io/angular-v20-is-now-available-6d41130c9bdf)
- [Signal Best Practices](https://angular.dev/guide/signals#best-practices)

## 🤝 Contributing

Feel free to enhance this POC with:
- Additional features
- Better styling
- More complex state management
- Unit tests
- Documentation improvements

---

**Built with ❤️ using Angular 20 Signals**
