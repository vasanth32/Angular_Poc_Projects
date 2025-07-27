# 🚀 Angular Signals Quick Reference

> **Essential Signal concepts and syntax at a glance**

## 📋 Signal Basics

### Create Signals
```typescript
import { signal } from '@angular/core';

// Basic signal
const count = signal(0);

// Typed signal
const name = signal<string>('John');

// Object signal
const user = signal({ name: 'John', age: 25 });
```

### Read Signals
```typescript
// In component
const value = count(); // Call as function

// In template
<span>{{ count() }}</span>
```

### Update Signals
```typescript
// Direct assignment
count.set(10);

// Functional update (recommended)
count.update(current => current + 1);

// Mutate objects
user.mutate(u => u.age = 26);
```

## 🔒 Signal Types

### Writable Signal
```typescript
const count = signal(0);
count.set(5);        // ✅ Can write
count.update(n => n + 1); // ✅ Can update
```

### Readonly Signal
```typescript
const readonlyCount = count.asReadonly();
readonlyCount();     // ✅ Can read
readonlyCount.set(5); // ❌ Cannot write
```

### Computed Signal
```typescript
import { computed } from '@angular/core';

const doubleCount = computed(() => count() * 2);
// Automatically updates when count changes
```

## 🎯 Component Usage

### Service Pattern
```typescript
// cart.service.ts
@Injectable({ providedIn: 'root' })
export class CartService {
  private itemCount = signal(0);
  
  get cartCount() {
    return this.itemCount.asReadonly();
  }
  
  addItem() {
    this.itemCount.update(count => count + 1);
  }
}
```

### Component Consumption
```typescript
// navbar.component.ts
export class NavbarComponent {
  private cartService = inject(CartService);
  cartCount = this.cartService.cartCount;
}

// Template
<span>{{ cartCount() }}</span>
```

## ⚡ Advanced Features

### Effects
```typescript
import { effect } from '@angular/core';

effect(() => {
  console.log('Count changed:', count());
});
```

### Signal Arrays
```typescript
const items = signal<string[]>([]);

// Add item
items.update(current => [...current, 'new item']);

// Remove item
items.update(current => current.filter(item => item !== 'item to remove'));
```

### Signal Objects
```typescript
const user = signal({ name: 'John', age: 25 });

// Update property
user.update(current => ({ ...current, age: 26 }));

// Or mutate
user.mutate(current => current.age = 26);
```

## 🔄 Template Usage

### Basic Binding
```typescript
<span>{{ count() }}</span>
```

### Conditional Display
```typescript
<span *ngIf="count() > 0">{{ count() }}</span>
```

### Class Binding
```typescript
<span [class.hidden]="count() === 0">{{ count() }}</span>
```

### Style Binding
```typescript
<span [style.color]="count() > 5 ? 'red' : 'green'">{{ count() }}</span>
```

## ✅ Best Practices

### Do's ✅
```typescript
// Use functional updates
count.update(n => n + 1);

// Expose readonly signals
get cartCount() {
  return this.itemCount.asReadonly();
}

// Use computed for derived state
const total = computed(() => price() * quantity());
```

### Don'ts ❌
```typescript
// Avoid direct assignment in updates
count.set(count() + 1);

// Don't expose writable signals
cartCount = this.itemCount;

// Don't put side effects in computed
const info = computed(() => {
  console.log('Computing...'); // Side effect
  return count();
});
```

## 🔍 Signals vs RxJS

| Operation | Signals | RxJS |
|-----------|---------|------|
| **Create** | `signal(0)` | `new BehaviorSubject(0)` |
| **Read** | `signal()` | `subscribe()` |
| **Update** | `update(n => n + 1)` | `next(value)` |
| **Cleanup** | Automatic | Manual `unsubscribe()` |

## 🎯 Common Patterns

### Counter Service
```typescript
@Injectable({ providedIn: 'root' })
export class CounterService {
  private count = signal(0);
  
  get value() {
    return this.count.asReadonly();
  }
  
  increment() {
    this.count.update(n => n + 1);
  }
  
  decrement() {
    this.count.update(n => Math.max(0, n - 1));
  }
  
  reset() {
    this.count.set(0);
  }
}
```

### Todo List Service
```typescript
@Injectable({ providedIn: 'root' })
export class TodoService {
  private todos = signal<string[]>([]);
  
  get items() {
    return this.todos.asReadonly();
  }
  
  add(todo: string) {
    this.todos.update(current => [...current, todo]);
  }
  
  remove(index: number) {
    this.todos.update(current => current.filter((_, i) => i !== index));
  }
}
```

### Shopping Cart Service
```typescript
@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<Product[]>([]);
  
  get cartItems() {
    return this.items.asReadonly();
  }
  
  get itemCount() {
    return computed(() => this.items().length);
  }
  
  addItem(product: Product) {
    this.items.update(current => [...current, product]);
  }
  
  removeItem(productId: number) {
    this.items.update(current => current.filter(item => item.id !== productId));
  }
}
```

## 🚀 Performance Tips

1. **Use computed for expensive calculations**
2. **Keep signals simple and focused**
3. **Use effects sparingly**
4. **Prefer functional updates over direct assignment**
5. **Expose readonly signals to components**

---

**Keep this reference handy while learning Angular Signals! 📚** 