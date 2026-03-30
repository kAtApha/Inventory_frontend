import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);

  products: Product[] = [];
  categories: Category[] = [];
  search = '';
  selectedCategoryId?: number;
  showModal = false;
  editingProduct?: Product;
  loading = false;

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    quantity: [0, [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]],
    lowStockThreshold: [5, [Validators.required, Validators.min(1)]],
    categoryId: [null as number | null, Validators.required]
  });

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAll(this.search || undefined, this.selectedCategoryId).subscribe({
      next: (data) => { this.products = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(data => this.categories = data);
  }

  openCreate() {
    this.editingProduct = undefined;
    this.form.reset({ quantity: 0, price: 0, lowStockThreshold: 5 });
    this.showModal = true;
  }

  openEdit(product: Product) {
    this.editingProduct = product;
    this.form.patchValue({
      name: product.name,
      description: product.description,
      quantity: product.quantity,
      price: product.price,
      lowStockThreshold: product.lowStockThreshold,
      categoryId: product.categoryId
    });
    this.showModal = true;
  }

  save() {
    if (this.form.invalid) return;
    const payload = this.form.value as any;

    if (this.editingProduct) {
      this.productService.update(this.editingProduct.id, payload).subscribe(() => {
        this.showModal = false;
        this.loadProducts();
      });
    } else {
      this.productService.create(payload).subscribe(() => {
        this.showModal = false;
        this.loadProducts();
      });
    }
  }

  delete(id: number) {
    if (!confirm('Delete this product?')) return;
    this.productService.delete(id).subscribe(() => this.loadProducts());
  }

  get lowStockCount() {
    return this.products.filter(p => p.isLowStock).length;
  }
}
