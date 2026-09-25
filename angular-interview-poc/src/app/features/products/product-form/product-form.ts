import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-product-form',
  styleUrl: './product-form.css',
  templateUrl: './product-form.html',
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);

  productForm = this.fb.group({
    title: ['', Validators.required],
    price: [0, Validators.required],
    stock: [0, Validators.required],
    category: ['', Validators.required],
  });

  ngOnInit(): void {
    this.productForm.controls.title.valueChanges.subscribe((value) => {
      console.log('Title changed:', value);
    });
  }

 save(): void {
  if (this.productForm.invalid) {
    this.productForm.markAllAsTouched();
    return;
  }

  console.log(this.productForm.value);
}

}
