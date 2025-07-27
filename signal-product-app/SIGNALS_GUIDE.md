# 🚀 Angular Signals Quick Reference Guide

## 📋 Signal Types

### 1. **Writable Signals** (State)
```typescript
// Create a signal
const count = signal(0);

// Read a signal
console.log(count()); // 0

// Update a signal
count.set(5); // Set new value
count.update(current => current + 1); // Update based on current value
```

### 2. **Computed Signals** (Derived State)
```typescript
// Create computed signal
const doubleCount = computed(() => count() * 2);

// Computed signals update automatically when dependencies change
console.log(doubleCount()); // 10 (when count is 5)
```

### 3. **Signal Inputs** (Component Props)
```typescript
// In child component
export class ChildComponent {
  // Required input
  data = input.required<string>();
  
  // Optional input with default
  title = input('Default Title');
  
  // Optional input
  description = input<string>();
}
```

### 4. **Signal Outputs** (Component Events)
```typescript
// In child component
export class ChildComponent {
  // Create output
  itemSelected = output<string>();
  
  // Emit event
  onSelect(item: string) {
    this.itemSelected.emit(item);
  }
}
```

## 🔄 Signal Communication Patterns

### Parent → Child (Input)
```typescript
// Parent component
export class ParentComponent {
  userData = signal({ name: 'John', age: 30 });
}

// Parent template
<app-child [data]="userData()"></app-child>

// Child component
export class ChildComponent {
  data = input.required<any>();
}
```

### Child → Parent (Output)
```typescript
// Child component
export class ChildComponent {
  dataChanged = output<any>();
  
  onDataChange(newData: any) {
    this.dataChanged.emit(newData);
  }
}

// Parent template
<app-child (dataChanged)="handleDataChange($event)"></app-child>

// Parent component
export class ParentComponent {
  handleDataChange(data: any) {
    // Handle the emitted data
  }
}
```

### Bidirectional Communication
```typescript
// Parent component
export class ParentComponent {
  sharedData = signal('initial value');
  
  updateData(newValue: string) {
    this.sharedData.set(newValue);
  }
}

// Parent template
<app-child 
  [data]="sharedData()" 
  (dataChanged)="updateData($event)">
</app-child>

// Child component
export class ChildComponent {
  data = input.required<string>();
  dataChanged = output<string>();
  
  updateData() {
    this.dataChanged.emit('new value');
  }
}
```

## 🎯 Common Patterns

### 1. **List Management**
```typescript
// State
const items = signal<string[]>([]);

// Add item
items.update(current => [...current, 'new item']);

// Remove item
items.update(current => current.filter(item => item !== 'item to remove'));

// Update item
items.update(current => 
  current.map(item => item === 'old' ? 'new' : item)
);
```

### 2. **Object Updates**
```typescript
// State
const user = signal({ name: 'John', age: 30 });

// Update specific property
user.update(current => ({ ...current, age: 31 }));

// Update multiple properties
user.update(current => ({ 
  ...current, 
  name: 'Jane', 
  age: 25 
}));
```

### 3. **Conditional Computed Signals**
```typescript
const isLoggedIn = signal(false);
const userData = signal(null);

const displayName = computed(() => {
  if (!isLoggedIn()) return 'Guest';
  return userData()?.name || 'Unknown User';
});
```

### 4. **Async Data Handling**
```typescript
const isLoading = signal(false);
const data = signal<any[]>([]);
const error = signal<string | null>(null);

const loadData = async () => {
  isLoading.set(true);
  error.set(null);
  
  try {
    const result = await fetchData();
    data.set(result);
  } catch (err) {
    error.set(err.message);
  } finally {
    isLoading.set(false);
  }
};
```

## ⚡ Performance Tips

### 1. **Use Computed Signals for Derived Data**
```typescript
// Good - only recalculates when items change
const totalPrice = computed(() => 
  items().reduce((sum, item) => sum + item.price, 0)
);

// Avoid - recalculates on every change detection
get totalPrice(): number {
  return this.items.reduce((sum, item) => sum + item.price, 0);
}
```

### 2. **Avoid Reading Signals in Loops**
```typescript
// Good
const items = signal<string[]>([]);
const itemCount = computed(() => items().length);

// Avoid
const itemCount = computed(() => {
  let count = 0;
  for (let i = 0; i < items().length; i++) {
    count++; // Reading signal in loop
  }
  return count;
});
```

### 3. **Use Effect for Side Effects**
```typescript
import { effect } from '@angular/core';

// Side effect when data changes
effect(() => {
  console.log('Data changed:', data());
  // Perform side effect
});
```

## 🔧 Migration from Traditional Patterns

### From @Input to Signal Input
```typescript
// Before
@Input() product!: Product;

// After
product = input.required<Product>();
```

### From @Output to Signal Output
```typescript
// Before
@Output() addToCart = new EventEmitter<Product>();

// After
addToCart = output<Product>();
```

### From getter to Computed Signal
```typescript
// Before
get totalPrice(): number {
  return this.items.reduce((sum, item) => sum + item.price, 0);
}

// After
totalPrice = computed(() => 
  this.items().reduce((sum, item) => sum + item.price, 0)
);
```

## 🎨 Template Syntax

### Reading Signals
```html
<!-- Read signal value -->
<p>{{ userName() }}</p>

<!-- Use in computed signal -->
<p>Total: {{ totalPrice() }}</p>

<!-- Conditional rendering -->
<div *ngIf="isLoggedIn()">Welcome back!</div>

<!-- List rendering -->
<div *ngFor="let item of items()">
  {{ item.name }}
</div>
```

### Binding to Signals
```html
<!-- Property binding -->
<img [src]="userAvatar()" [alt]="userName()">

<!-- Event binding -->
<button (click)="onAddToCart()">Add to Cart</button>

<!-- Two-way binding (with forms) -->
<input [(ngModel)]="userName()">
```

## 🚨 Common Pitfalls

### 1. **Forgetting to Call Signal**
```typescript
// Wrong - missing ()
const userName = signal('John');
console.log(userName); // Signal object, not value

// Correct
console.log(userName()); // 'John'
```

### 2. **Mutating Signal Value**
```typescript
// Wrong - mutation doesn't trigger updates
const items = signal<string[]>([]);
items().push('new item'); // Won't work!

// Correct - immutable update
items.update(current => [...current, 'new item']);
```

### 3. **Reading Signal Outside Effect/Computed**
```typescript
// Wrong - no dependency tracking
const count = signal(0);
setTimeout(() => {
  console.log(count()); // No reactivity
}, 1000);

// Correct - use effect
effect(() => {
  console.log('Count changed:', count());
});
```

---

**Remember**: Signals are reactive by design. They automatically track dependencies and update only when necessary, providing better performance and a cleaner mental model for state management. 