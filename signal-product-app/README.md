# 🧩 Angular Signals Communication POC

A comprehensive proof-of-concept demonstrating modern Angular signal-based communication between components using `@Input({ signal: true })` and signal-based outputs.

## 🚀 Live Demo

The application is running at: **http://localhost:4200**

## 📚 What You'll Learn

This POC teaches you:
- **Signal-based Inputs**: How to pass data between components using signals
- **Signal-based Outputs**: How to emit events using signals
- **Computed Signals**: How to create derived state that updates automatically
- **Reactive UI**: How signals enable automatic UI updates
- **Modern Angular Patterns**: Standalone components and signal-first architecture

## 🏗️ Project Structure

```
signal-product-app/
├── src/app/
│   ├── models/
│   │   └── product.interface.ts     # Product data structure
│   ├── product-card/
│   │   ├── product-card.component.ts # Signal-based child component
│   │   ├── product-card.component.html
│   │   └── product-card.component.css
│   ├── app.component.ts             # Signal-based parent component
│   ├── app.component.html
│   └── app.component.css
└── README.md
```

## 🎯 Core Concepts Explained

### 1. **What are Angular Signals?**

Signals are a new reactive primitive in Angular that represent a value that changes over time. They provide:
- **Fine-grained reactivity**: Only components that depend on a signal re-render
- **Automatic dependency tracking**: No need to manually subscribe/unsubscribe
- **Better performance**: More efficient than traditional change detection
- **Type safety**: Full TypeScript support

### 2. **Signal-based Inputs vs Traditional @Input**

#### Traditional Approach (Old Way):
```typescript
// Child Component
@Component({...})
export class ProductCardComponent {
  @Input() product!: Product; // Traditional input
}

// Parent Template
<app-product-card [product]="productData"></app-product-card>
```

#### Signal-based Approach (New Way):
```typescript
// Child Component
@Component({...})
export class ProductCardComponent {
  product = input.required<Product>(); // Signal-based input
}

// Parent Template
<app-product-card [product]="currentProduct()"></app-product-card>
```

**Key Differences:**
- Signal inputs use `input.required<T>()` instead of `@Input()`
- Parent passes signal value with `()` syntax: `currentProduct()`
- Automatic reactivity when signal changes

### 3. **Signal-based Outputs vs Traditional @Output**

#### Traditional Approach (Old Way):
```typescript
// Child Component
@Component({...})
export class ProductCardComponent {
  @Output() addToCart = new EventEmitter<Product>();
}

// Parent Template
<app-product-card (addToCart)="handleAddToCart($event)"></app-product-card>
```

#### Signal-based Approach (New Way):
```typescript
// Child Component
@Component({...})
export class ProductCardComponent {
  addToCart = output<Product>(); // Signal-based output
}

// Parent Template
<app-product-card (addToCart)="onAddToCart($event)"></app-product-card>
```

**Key Differences:**
- Signal outputs use `output<T>()` instead of `EventEmitter`
- Cleaner syntax and better performance
- Type-safe event emission

### 4. **Computed Signals**

Computed signals automatically update when their dependencies change:

```typescript
// Computed signal for cart count
cartCount = computed(() => this.cartItems().length);

// Computed signal for formatted price
formattedPrice = computed(() => {
  const product = this.product();
  return `$${product.price.toFixed(2)}`;
});
```

**Benefits:**
- **Automatic updates**: No manual subscription management
- **Performance**: Only recalculates when dependencies change
- **Caching**: Results are cached until dependencies change

## 🔧 Implementation Details

### ProductCard Component (Child)

```typescript
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  // Signal-based input - receives product data
  product = input.required<Product>();

  // Signal-based output - emits when add to cart is clicked
  addToCart = output<Product>();

  // Computed signal - automatically formats price
  formattedPrice = computed(() => {
    const product = this.product();
    return `$${product.price.toFixed(2)}`;
  });

  onAddToCart(): void {
    // Emit the current product signal
    this.addToCart.emit(this.product());
  }
}
```

**Key Features:**
- `input.required<Product>()` - Required signal input
- `output<Product>()` - Signal-based output
- `computed()` - Derived signal that updates automatically
- Reactive template binding with `product()` and `formattedPrice()`

### AppComponent (Parent)

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // Signal for current product
  currentProduct = signal<Product>({
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    price: 89.99,
    description: 'High-quality wireless headphones...',
    imageUrl: 'https://...',
    category: 'Electronics',
    inStock: true
  });

  // Signal for cart items
  cartItems = signal<Product[]>([]);

  // Computed signals
  cartCount = computed(() => this.cartItems().length);
  cartTotal = computed(() => {
    return this.cartItems().reduce((total, item) => total + item.price, 0);
  });

  // Handle add to cart event from child component
  onAddToCart(product: Product): void {
    this.cartItems.update(items => [...items, product]);
    // Show notification...
  }
}
```

**Key Features:**
- `signal<T>()` - Creates writable signals
- `computed()` - Creates derived signals
- `update()` - Updates signal value immutably
- Reactive template with computed signals

## 🎮 Interactive Features

### 1. **Add to Cart**
- Click "Add to Cart" button in ProductCard
- Product is emitted as signal to parent
- Cart state updates automatically
- Notification appears

### 2. **Stock Toggle**
- Click "Set Out of Stock" / "Set In Stock"
- Product signal updates
- ProductCard button state changes reactively
- No manual change detection needed

### 3. **Cart Management**
- Cart count and total update automatically
- Clear cart functionality
- Real-time UI updates

## 🚀 Performance Benefits

### Traditional vs Signal-based Performance

| Aspect | Traditional | Signal-based |
|--------|-------------|--------------|
| Change Detection | Zone.js triggers full tree | Only affected components |
| Memory Usage | Manual subscription management | Automatic cleanup |
| Bundle Size | Larger due to Zone.js | Smaller, tree-shakeable |
| Developer Experience | Manual dependency tracking | Automatic tracking |

## 🔄 Signal Lifecycle

1. **Creation**: `signal<T>(initialValue)`
2. **Reading**: `signalValue()` - triggers dependency tracking
3. **Writing**: `signalValue.set(newValue)` or `signalValue.update()`
4. **Computation**: `computed(() => derivedValue)`
5. **Cleanup**: Automatic when component is destroyed

## 📖 Best Practices

### 1. **Signal Naming**
```typescript
// Good
currentProduct = signal<Product>(product);
cartItems = signal<Product[]>([]);

// Avoid
product = signal<Product>(product); // Too generic
```

### 2. **Computed Signal Optimization**
```typescript
// Good - only recalculates when cartItems changes
cartTotal = computed(() => {
  return this.cartItems().reduce((total, item) => total + item.price, 0);
});

// Avoid - recalculates on every change detection
get cartTotal(): number {
  return this.cartItems.reduce((total, item) => total + item.price, 0);
}
```

### 3. **Signal Updates**
```typescript
// Good - immutable updates
cartItems.update(items => [...items, newItem]);

// Good - simple value setting
showNotification.set(true);

// Avoid - direct mutation
cartItems().push(newItem); // Won't trigger updates
```

## 🧪 Testing the POC

1. **Start the application**: `ng serve`
2. **Open browser**: Navigate to `http://localhost:4200`
3. **Test features**:
   - Click "Add to Cart" multiple times
   - Toggle stock status
   - Clear cart
   - Watch notifications

## 🔮 Future of Angular Signals

Signals represent the future of Angular state management:
- **Replacing RxJS** for simple state management
- **Better performance** than traditional change detection
- **Simpler mental model** for developers
- **Gradual migration** - can coexist with existing patterns

## 📚 Additional Resources

- [Angular Signals Documentation](https://angular.dev/guide/signals)
- [Signal-based Components](https://angular.dev/guide/components/signals)
- [Computed Signals](https://angular.dev/guide/signals/computed)
- [Signal Inputs and Outputs](https://angular.dev/guide/components/signals#signal-inputs)

## 🤝 Contributing

Feel free to extend this POC with:
- Multiple products
- Shopping cart persistence
- Product filtering
- Advanced signal patterns

---

**Happy Learning! 🎉**

This POC demonstrates the power and simplicity of Angular's new signal-based architecture. Signals provide a more intuitive and performant way to handle component communication and state management.
