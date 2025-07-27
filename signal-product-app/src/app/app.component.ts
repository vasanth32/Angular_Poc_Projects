import { Component, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './product-card/product-card.component';
import { Product } from './models/product.interface';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ProductCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Signal Product App - Signal Communication POC';

  // Signal for current product
  currentProduct = signal<Product>({
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    price: 89.99,
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
    category: 'Electronics',
    inStock: true
  });

  // Signal for cart items
  cartItems = signal<Product[]>([]);

  // Computed signal for cart count
  cartCount = computed(() => this.cartItems().length);

  // Computed signal for total cart value
  cartTotal = computed(() => {
    return this.cartItems().reduce((total, item) => total + item.price, 0);
  });

  // Signal for showing notifications
  showNotification = signal(false);
  notificationMessage = signal('');

  onAddToCart(product: Product): void {
    // Add product to cart
    this.cartItems.update(items => [...items, product]);

    // Show notification
    this.notificationMessage.set(`${product.name} added to cart!`);
    this.showNotification.set(true);

    // Hide notification after 3 seconds
    setTimeout(() => {
      this.showNotification.set(false);
    }, 3000);
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.notificationMessage.set('Cart cleared!');
    this.showNotification.set(true);

    setTimeout(() => {
      this.showNotification.set(false);
    }, 3000);
  }

  updateProductStock(inStock: boolean): void {
    this.currentProduct.update(product => ({
      ...product,
      inStock
    }));
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
