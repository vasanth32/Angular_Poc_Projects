// navbar.component.ts
import { Component, inject } from '@angular/core';
import { CartService } from './cart.service';
import { CommonModule } from '@angular/common';
import { Signal } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-content">
        <h1>🛒 Shopping Cart POC</h1>
        <div class="cart-section">
          <span class="cart-text">Cart</span>
          <span class="badge" [class.hidden]="cartCount() === 0">{{ cartCount() }}</span>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }
    .cart-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .cart-text {
      font-size: 1.1rem;
      font-weight: 500;
    }
    .badge { 
      background: #ff4757;
      color: white;
      border-radius: 50%;
      padding: 0.25rem 0.6rem;
      font-size: 0.8rem;
      font-weight: bold;
      min-width: 1.5rem;
      text-align: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    .badge.hidden {
      opacity: 0;
    }
  `]
})
export class NavbarComponent {
  private cartService = inject(CartService);
  cartCount: Signal<number> = this.cartService.cartCount;
}
