export interface Product {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  quantity: number;
  price: number;
  lowStockThreshold: number;
  categoryId: number;
}

export type UpdateProductRequest = CreateProductRequest;
