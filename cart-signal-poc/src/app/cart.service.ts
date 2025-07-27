// cart.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemCount = signal(0);

  get cartCount() {
    return this.itemCount.asReadonly();
  }

  addItem() {
    this.itemCount.update(count => count + 1);
  }

  removeItem() {
    this.itemCount.update(count => Math.max(0, count - 1));
  }
}
