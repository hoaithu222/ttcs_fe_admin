import { Category } from "@/core/api/categories/type";
import { ReduxStateType } from "@/app/store/types";

export interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
  // trường hợp thêm
  createCategory: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  // trường hợp cập nhật
  updateCategory: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  // trường hợp xóa
  deleteCategory: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    search: string;
    isActive: boolean | undefined;
  };
}

export interface FetchCategoriesPayload {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  image?: Array<{ url: string; publicId: string }>;
  image_Background?: { url: string; publicId: string };
  image_Icon?: { url: string; publicId: string };
  banner?: string;
  isActive?: boolean;
  order_display?: number;
}

export interface UpdateCategoryPayload {
  id: string;
  data: {
    name?: string;
    description?: string;
    image?: Array<{ url: string; publicId: string }>;
    image_Background?: { url: string; publicId: string };
    image_Icon?: { url: string; publicId: string };
    banner?: string;
    isActive?: boolean;
    order_display?: number;
  };
}

export interface DeleteCategoryPayload {
  id: string;
}
