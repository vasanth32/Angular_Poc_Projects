import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'products',
		loadComponent: () =>
			import('./features/products/product-list/product-list').then(
				(component) => component.ProductList,
			),
	},
    {
        path: "products/form",
        loadComponent: () =>
            import("./features/products/product-form/product-form").then(
            (component) => component.ProductForm,
            ),
    },

	{ path: '', redirectTo: 'products', pathMatch: 'full' },
];
