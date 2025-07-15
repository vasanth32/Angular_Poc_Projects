import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStateService, Product, CartItem, CartState } from '../services/cart-state.service';
import { UserStateService } from '../services/user-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  
  // State variables
  cart: CartState | null = null;
  products: Product[] = [];
  
  // UI state
  selectedCategory: string = 'all';
  categories: string[] = ['all', 'Electronics', 'Accessories', 'Stationery'];
  
  // Subscriptions for cleanup
  private subscriptions: Subscription[] = [];

  constructor(
    private cartStateService: CartStateService,
    private userStateService: UserStateService
  ) {}

  ngOnInit() {
    // Load sample products
    this.products = this.cartStateService.getSampleProducts();
    
    // Subscribe to cart state changes
    const cartSubscription = this.cartStateService.cart$.subscribe(cart => {
      this.cart = cart;
      this.userStateService.logActivity('Cart state updated', 'ShoppingCartComponent');
    });
    
    this.subscriptions.push(cartSubscription);
    
    // Log initial load
    this.userStateService.logActivity('Shopping cart component loaded', 'ShoppingCartComponent');
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Get filtered products based on category
  get filteredProducts(): Product[] {
    if (this.selectedCategory === 'all') {
      return this.products;
    }
    return this.products.filter(product => product.category === this.selectedCategory);
  }

  // Check if product is in cart
  isInCart(productId: number): boolean {
    return this.cart?.items.some(item => item.product.id === productId) || false;
  }

  // Get quantity of product in cart
  getQuantityInCart(productId: number): number {
    const item = this.cart?.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }

  // Add product to cart
  addToCart(product: Product, quantity: number = 1) {
    this.cartStateService.addToCart(product, quantity);
    this.userStateService.logActivity(`Added ${product.name} to cart`, 'ShoppingCartComponent');
  }

  // Remove product from cart
  removeFromCart(productId: number) {
    const product = this.products.find(p => p.id === productId);
    this.cartStateService.removeFromCart(productId);
    this.userStateService.logActivity(`Removed ${product?.name || 'product'} from cart`, 'ShoppingCartComponent');
  }

  // Update quantity in cart
  updateQuantity(productId: number, newQuantity: number) {
    const product = this.products.find(p => p.id === productId);
    this.cartStateService.updateQuantity(productId, newQuantity);
    this.userStateService.logActivity(`Updated ${product?.name || 'product'} quantity to ${newQuantity}`, 'ShoppingCartComponent');
  }

  // Clear entire cart
  clearCart() {
    this.cartStateService.clearCart();
    this.userStateService.logActivity('Cleared entire cart', 'ShoppingCartComponent');
  }

  // Filter products by category
  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.userStateService.logActivity(`Filtered products by category: ${category}`, 'ShoppingCartComponent');
  }

  // Get cart summary for display
  getCartSummary() {
    if (!this.cart) return null;
    
    return {
      totalItems: this.cart.itemCount,
      totalPrice: this.cart.total,
      itemsCount: this.cart.items.length,
      isEmpty: this.cart.items.length === 0,
      lastUpdated: this.cart.lastUpdated
    };
  }

  // Format date for display
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  }

  // Increase quantity
  increaseQuantity(productId: number) {
    const currentQuantity = this.getQuantityInCart(productId);
    this.updateQuantity(productId, currentQuantity + 1);
  }

  // Decrease quantity
  decreaseQuantity(productId: number) {
    const currentQuantity = this.getQuantityInCart(productId);
    if (currentQuantity > 1) {
      this.updateQuantity(productId, currentQuantity - 1);
    } else {
      this.removeFromCart(productId);
    }
  }
}
