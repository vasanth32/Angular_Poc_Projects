import { Service } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ProductResponse } from "../models/product-response";
import { Product } from "../models/product";
import { Injectable, inject } from '@angular/core';
import {catchError, of, map, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ProductService {
    
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://dummyjson.com/products';
    getProducts(): Observable<Product[]> {
    return this.http.get<ProductResponse>(this.apiUrl).pipe(
        tap(response => console.log("Raw API response:", response)),
        map(response => response.products),
        map(products =>
        products.filter(product => product.stock > 0)
        )
    );
    }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
  searchProducts(term: string): Observable<Product[]> {
  return this.http
    .get<ProductResponse>(
      `${this.apiUrl}/search?q=${encodeURIComponent(term)}`
    )
    .pipe(
      map(response => response.products)
    );
}

}