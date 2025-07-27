// products.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from './cart.service';

@Component({
  standalone: true,
  selector: 'app-products',
  imports: [CommonModule],
  template: `
    <div class="products-container">
      <h2>🛍️ Products</h2>
      <p class="description">Click the buttons below to add or remove items from your cart. Watch the badge in the navbar update in real-time!</p>
      
      <div class="button-group">
        <button class="btn btn-add" (click)="addToCart()">
          ➕ Add Item to Cart
        </button>
        <button class="btn btn-remove" (click)="removeFromCart()">
          ➖ Remove Item
        </button>
      </div>
      
      <div class="cart-info">
        <p>Current cart count: <strong>{{ cart.cartCount() }}</strong></p>
      </div>
    </div>
  `,
  styles: [`
    .products-container {
      max-width: 600px;
      margin: 0 auto;
      text-align: center;
    }
    
    h2 {
      color: #2c3e50;
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .description {
      color: #7f8c8d;
      font-size: 1.1rem;
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    
    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 2rem;
    }
    
    .btn {
      padding: 1rem 2rem;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .btn-add {
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: white;
    }
    
    .btn-add:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
    }
    
    .btn-remove {
      background: linear-gradient(135deg, #f44336, #da190b);
      color: white;
    }
    
    .btn-remove:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(244, 67, 54, 0.3);
    }
    
    .cart-info {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 10px;
      border: 2px solid #e9ecef;
    }
    
    .cart-info p {
      margin: 0;
      font-size: 1.2rem;
      color: #495057;
    }
    
    .cart-info strong {
      color: #007bff;
      font-size: 1.4rem;
    }
  `]
})
export class ProductsComponent {
  cart = inject(CartService);

  addToCart() {
    this.cart.addItem();
  }

  removeFromCart() {
    this.cart.removeItem();
  }
}
