import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'products',
		loadComponent: () =>
			import('./features/products/product-list/product-list').then(
				(component) => component.ProductList,
			),
	},
	{ path: '', redirectTo: 'products', pathMatch: 'full' },
];
