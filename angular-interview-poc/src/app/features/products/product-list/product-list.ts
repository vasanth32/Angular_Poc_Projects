import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {

  private productService = inject(ProductService);
  products = signal<Product[]>([]);
  loading = signal(true);

  ngOnInit(): void {

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.loading.set(false);
      },
    });

  }
}

