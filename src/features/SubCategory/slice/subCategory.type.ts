import { SubCategory } from "@/core/api/sub-categories/type";
import { ReduxStateType } from "@/app/store/types";

export interface SubCategoryState {
  subCategories: SubCategory[];
  selectedSubCategory: SubCategory | null;
  isLoading: boolean;
  error: string | null;
  createSubCategory: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  updateSubCategory: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  deleteSubCategory: {
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
    parentId?: string | undefined;
  };
}

export interface FetchSubCategoriesPayload {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  parentId?: string;
}

export interface CreateSubCategoryPayload {
  name: string;
  description?: string;
  image?: string;
  parentId: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateSubCategoryPayload {
  id: string;
  data: {
    name?: string;
    description?: string;
    image?: string;
    parentId?: string;
    isActive?: boolean;
    sortOrder?: number;
  };
}
