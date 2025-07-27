import { Component, input, output, computed } from '@angular/core';
import { Product } from '../models/product.interface';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  // Signal-based input for product data
  product = input.required<Product>();

  // Signal-based output for add to cart event
  addToCart = output<Product>();

  // Computed signal for formatted price
  formattedPrice = computed(() => {
    const product = this.product();
    return `$${product.price.toFixed(2)}`;
  });

  onAddToCart(): void {
    // Emit the product signal when add to cart is clicked
    this.addToCart.emit(this.product());
  }
}
