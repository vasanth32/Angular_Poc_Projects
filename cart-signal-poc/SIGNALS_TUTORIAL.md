# 🧠 Angular Signals Tutorial: From Basics to Shopping Cart

> **Learn Angular Signals through our Shopping Cart POC**

## 📚 Table of Contents

1. [What are Signals?](#what-are-signals)
2. [Signal Types](#signal-types)
3. [Signal Operations](#signal-operations)
4. [Signal Consumption](#signal-consumption)
5. [Real-world Example: Shopping Cart](#real-world-example-shopping-cart)
6. [Signals vs RxJS](#signals-vs-rxjs)
7. [Best Practices](#best-practices)
8. [Advanced Concepts](#advanced-concepts)

---

## 🎯 What are Signals?

### Definition
Signals are Angular's new **reactive primitive** that provides fine-grained reactivity for state management.

### Why Signals?
- **Simpler than RxJS** for basic state management
- **Automatic cleanup** - no manual unsubscription
- **Better performance** - only affected components re-render
- **Type-safe** - full TypeScript support

### Basic Concept
```typescript
// Create a signal
const count = signal(0);

// Read signal value
console.log(count()); // 0

// Update signal value
count.set(5);
console.log(count()); // 5
```

---

## 📊 Signal Types

### 1. Writable Signal
```typescript
// Can be read and written
const count = signal(0);
count.set(10);        // Direct assignment
count.update(n => n + 1); // Functional update
```

### 2. Readonly Signal
```typescript
// Can only be read, not modified
const readonlyCount = count.asReadonly();
readonlyCount(); // ✅ Read value
readonlyCount.set(5); // ❌ Error - cannot modify
```

### 3. Computed Signal
```typescript
// Derived from other signals
const doubleCount = computed(() => count() * 2);
console.log(doubleCount()); // Automatically updates when count changes
```

---

## ⚡ Signal Operations

### Creating Signals
```typescript
import { signal } from '@angular/core';

// Basic signal
const name = signal('John');

// Typed signal
const age = signal<number>(25);

// Object signal
const user = signal({ name: 'John', age: 25 });
```

### Reading Signals
```typescript
// In component class
export class MyComponent {
  count = signal(0);
  
  getValue() {
    return this.count(); // Call as function
  }
}

// In template
<span>{{ count() }}</span>
```

### Updating Signals
```typescript
// Method 1: Direct assignment
count.set(10);

// Method 2: Functional update (recommended)
count.update(current => current + 1);

// Method 3: Mutate (for objects/arrays)
const user = signal({ name: 'John', age: 25 });
user.mutate(user => user.age = 26);
```

---

## 🎯 Signal Consumption

### In Components
```typescript
import { Component, inject } from '@angular/core';
import { CartService } from './cart.service';

@Component({
  selector: 'app-navbar',
  template: `
    <span>Cart: {{ cartCount() }}</span>
  `
})
export class NavbarComponent {
  private cartService = inject(CartService);
  
  // Get readonly signal
  cartCount = this.cartService.cartCount;
}
```

### In Templates
```typescript
// Direct usage
<span>{{ cartCount() }}</span>

// With conditions
<span *ngIf="cartCount() > 0">{{ cartCount() }}</span>

// With styling
<span [class.hidden]="cartCount() === 0">{{ cartCount() }}</span>
```

---

## 🛒 Real-world Example: Shopping Cart

Let's break down our shopping cart implementation:

### Step 1: Create the Service
```typescript
// cart.service.ts
import { Injectable, signal } from '@angular/core';

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

**Key Concepts:**
- `signal(0)` - Creates writable signal with initial value
- `asReadonly()` - Exposes signal as read-only to components
- `update()` - Functional update method

### Step 2: Consume in Component
```typescript
// navbar.component.ts
export class NavbarComponent {
  private cartService = inject(CartService);
  
  // Get the signal
  cartCount = this.cartService.cartCount;
}
```

**Key Concepts:**
- `inject()` - Modern dependency injection
- Signal assignment - No subscription needed
- Automatic reactivity - Template updates automatically

### Step 3: Use in Template
```typescript
// navbar.component.ts template
template: `
  <nav class="navbar">
    <span class="badge" [class.hidden]="cartCount() === 0">
      {{ cartCount() }}
    </span>
  </nav>
`
```

**Key Concepts:**
- `cartCount()` - Call signal as function in template
- Reactive binding - Badge updates automatically
- Conditional styling - Hide when count is 0

### Step 4: Trigger Updates
```typescript
// products.component.ts
export class ProductsComponent {
  cart = inject(CartService);

  addToCart() {
    this.cart.addItem(); // Updates signal
  }

  removeFromCart() {
    this.cart.removeItem(); // Updates signal
  }
}
```

**Key Concepts:**
- Service methods trigger signal updates
- UI automatically reflects changes
- No manual state management

---

## 🔍 Signals vs RxJS Comparison

| Aspect | Signals | RxJS |
|--------|---------|------|
| **Creation** | `signal(0)` | `new BehaviorSubject(0)` |
| **Reading** | `signal()` | `subscribe()` |
| **Updating** | `update(n => n + 1)` | `next(value)` |
| **Cleanup** | Automatic | Manual `unsubscribe()` |
| **Performance** | Fine-grained | Coarse-grained |
| **Learning Curve** | Simple | Complex |
| **Use Case** | Simple state | Complex async operations |

### Code Comparison

#### Signals (Simple)
```typescript
// Service
const count = signal(0);
const addOne = () => count.update(n => n + 1);

// Component
const countSignal = count.asReadonly();

// Template
<span>{{ countSignal() }}</span>
```

#### RxJS (Complex)
```typescript
// Service
const count$ = new BehaviorSubject(0);
const addOne = () => count$.next(count$.value + 1);

// Component
count$ = this.count$.asObservable();

// Template
<span>{{ count$ | async }}</span>

// Cleanup required
ngOnDestroy() {
  this.subscription.unsubscribe();
}
```

---

## ✅ Best Practices

### 1. **Use Functional Updates**
```typescript
// ✅ Good
count.update(n => n + 1);

// ❌ Avoid
count.set(count() + 1);
```

### 2. **Expose Readonly Signals**
```typescript
// ✅ Good
get cartCount() {
  return this.itemCount.asReadonly();
}

// ❌ Avoid
cartCount = this.itemCount; // Exposes writable signal
```

### 3. **Use Computed for Derived State**
```typescript
// ✅ Good
const doubleCount = computed(() => count() * 2);

// ❌ Avoid
const doubleCount = signal(count() * 2); // Won't update
```

### 4. **Keep Signals Simple**
```typescript
// ✅ Good - Single responsibility
const itemCount = signal(0);
const totalPrice = signal(0);

// ❌ Avoid - Complex object
const cart = signal({
  items: [],
  total: 0,
  discount: 0
});
```

### 5. **Use Effects for Side Effects**
```typescript
// ✅ Good
effect(() => {
  console.log('Cart count changed:', cartCount());
});

// ❌ Avoid - Side effects in computed
const cartInfo = computed(() => {
  console.log('Computing...'); // Side effect
  return `Cart: ${cartCount()}`;
});
```

---

## 🚀 Advanced Concepts

### 1. **Computed Signals**
```typescript
const price = signal(10);
const quantity = signal(5);

// Computed signal
const total = computed(() => price() * quantity());

console.log(total()); // 50
```

### 2. **Effects**
```typescript
import { effect } from '@angular/core';

effect(() => {
  // Runs when any signal in this function changes
  console.log('Total changed:', total());
});
```

### 3. **Signal Arrays**
```typescript
const items = signal([
  { id: 1, name: 'Product 1', price: 10 },
  { id: 2, name: 'Product 2', price: 20 }
]);

// Add item
items.update(current => [...current, { id: 3, name: 'Product 3', price: 30 }]);

// Remove item
items.update(current => current.filter(item => item.id !== 1));
```

### 4. **Signal Objects**
```typescript
const user = signal({
  name: 'John',
  age: 25,
  email: 'john@example.com'
});

// Update specific property
user.update(current => ({ ...current, age: 26 }));

// Or use mutate
user.mutate(current => current.age = 26);
```

---

## 🧪 Practice Exercises

### Exercise 1: Counter
Create a simple counter using signals:
```typescript
// Create service
const count = signal(0);
const increment = () => count.update(n => n + 1);
const decrement = () => count.update(n => n - 1);
```

### Exercise 2: Todo List
Create a todo list with signals:
```typescript
const todos = signal<string[]>([]);
const addTodo = (todo: string) => todos.update(current => [...current, todo]);
const removeTodo = (index: number) => todos.update(current => current.filter((_, i) => i !== index));
```

### Exercise 3: Shopping Cart with Products
Extend our cart to include product objects:
```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

const cartItems = signal<Product[]>([]);
const addToCart = (product: Product) => cartItems.update(current => [...current, product]);
```

---

## 📚 Additional Resources

- [Angular Signals Official Docs](https://angular.dev/guide/signals)
- [Signal Best Practices](https://angular.dev/guide/signals#best-practices)
- [Angular 20 Release Notes](https://blog.angular.io/angular-v20-is-now-available-6d41130c9bdf)
- [Signal Examples](https://angular.dev/examples/signals)

---

## 🎉 Conclusion

Signals provide a **simpler, more performant** way to handle reactive state in Angular applications. They're perfect for:

- **Simple state management** (like our shopping cart)
- **Component communication**
- **Derived state calculations**
- **Real-time UI updates**

The key benefits are:
- ✅ **Less boilerplate** than RxJS
- ✅ **Automatic cleanup**
- ✅ **Better performance**
- ✅ **Easier to learn**

Start with signals for simple state, and use RxJS for complex async operations!

---

**Happy coding with Angular Signals! 🚀** 