import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { App } from './app/app';
import { ProductList } from './app/components/product-list/product-list';
import { ProductAdd } from './app/components/product-add/product-add';
import { ProductEdit } from './app/components/product-edit/product-edit';

const routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' as const },
  { path: 'products', component: ProductList },
  { path: 'add-product', component: ProductAdd },
  { path: 'edit-product/:id', component: ProductEdit }
];

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));
