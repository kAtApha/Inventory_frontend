export interface Category {
  id: number;
  name: string;
  description?: string;
  productCount: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export type UpdateCategoryRequest = CreateCategoryRequest;
