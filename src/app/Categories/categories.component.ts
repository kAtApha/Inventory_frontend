import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);

  categories: Category[] = [];
  showModal = false;
  editingCategory?: Category;

  form = this.fb.group({
    name: ['', Validators.required],
    description: ['']
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.categoryService.getAll().subscribe(data => this.categories = data);
  }

  openCreate() {
    this.editingCategory = undefined;
    this.form.reset();
    this.showModal = true;
  }

  openEdit(cat: Category) {
    this.editingCategory = cat;
    this.form.patchValue({ name: cat.name, description: cat.description });
    this.showModal = true;
  }

  save() {
    if (this.form.invalid) return;
    const payload = this.form.value as any;

    if (this.editingCategory) {
      this.categoryService.update(this.editingCategory.id, payload).subscribe(() => {
        this.showModal = false;
        this.load();
      });
    } else {
      this.categoryService.create(payload).subscribe(() => {
        this.showModal = false;
        this.load();
      });
    }
  }

  delete(id: number) {
    if (!confirm('Delete this category?')) return;
    this.categoryService.delete(id).subscribe(() => this.load());
  }
}
