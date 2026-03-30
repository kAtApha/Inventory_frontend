import { Routes } from '@angular/router';
import { ProductsComponent } from './Products/products.component';
import { CategoriesComponent } from './Categories/categories.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  { path: 'categories', component: CategoriesComponent }
];
