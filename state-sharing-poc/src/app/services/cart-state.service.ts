import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root' // Singleton service
})
export class CartStateService {
  
  // Private BehaviorSubject to hold cart state
  private cartSubject = new BehaviorSubject<CartState>({
    items: [],
    total: 0,
    itemCount: 0,
    lastUpdated: new Date()
  });

  // Public observable for components to subscribe to
  public cart$: Observable<CartState> = this.cartSubject.asObservable();

  // Derived observables
  public itemCount$: Observable<number> = this.cart$.pipe(
    map(cart => cart.itemCount)
  );

  public total$: Observable<number> = this.cart$.pipe(
    map(cart => cart.total)
  );

  public isEmpty$: Observable<boolean> = this.cart$.pipe(
    map(cart => cart.items.length === 0)
  );

  // Sample products for demonstration
  private sampleProducts: Product[] = [
    { id: 1, name: 'Laptop', price: 999.99, image: '💻', category: 'Electronics' },
    { id: 2, name: 'Smartphone', price: 699.99, image: '📱', category: 'Electronics' },
    { id: 3, name: 'Headphones', price: 199.99, image: '🎧', category: 'Electronics' },
    { id: 4, name: 'Coffee Mug', price: 15.99, image: '☕', category: 'Accessories' },
    { id: 5, name: 'Notebook', price: 12.99, image: '📓', category: 'Stationery' }
  ];

  // Getter for current cart state
  get currentCart(): CartState {
    return this.cartSubject.value;
  }

  // Get sample products
  getSampleProducts(): Product[] {
    return this.sampleProducts;
  }

  // Add item to cart
  addToCart(product: Product, quantity: number = 1) {
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.items.findIndex(item => item.product.id === product.id);

    let updatedItems: CartItem[];

    if (existingItemIndex >= 0) {
      // Update existing item
      updatedItems = currentCart.items.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Add new item
      const newItem: CartItem = {
        product,
        quantity,
        addedAt: new Date()
      };
      updatedItems = [...currentCart.items, newItem];
    }

    this.updateCartState(updatedItems);
  }

  // Remove item from cart
  removeFromCart(productId: number) {
    const currentCart = this.cartSubject.value;
    const updatedItems = currentCart.items.filter(item => item.product.id !== productId);
    this.updateCartState(updatedItems);
  }

  // Update item quantity
  updateQuantity(productId: number, newQuantity: number) {
    if (newQuantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentCart = this.cartSubject.value;
    const updatedItems = currentCart.items.map(item =>
      item.product.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );

    this.updateCartState(updatedItems);
  }

  // Clear cart
  clearCart() {
    this.updateCartState([]);
  }

  // Private method to update cart state and calculate totals
  private updateCartState(items: CartItem[]) {
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const newCartState: CartState = {
      items,
      total,
      itemCount,
      lastUpdated: new Date()
    };

    this.cartSubject.next(newCartState);
  }

  // Get cart summary
  getCartSummary(): Observable<{items: number, total: number, isEmpty: boolean}> {
    return this.cart$.pipe(
      map(cart => ({
        items: cart.itemCount,
        total: cart.total,
        isEmpty: cart.items.length === 0
      }))
    );
  }
} 