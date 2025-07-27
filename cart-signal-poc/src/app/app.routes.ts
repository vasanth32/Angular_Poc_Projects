import { Routes } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { ProductsComponent } from './products.component';

export const routes: Routes = [
    {
      path: '',
      component: ProductsComponent,
      providers: [],
    }
  ];