import { Service } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ProductResponse } from "../models/product-response";
import { Product } from "../models/product";
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
    
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://dummyjson.com/products';

  getProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(this.apiUrl);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

}