import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryState } from "./category.type";
import { Category } from "@/core/api/categories/type";
import { ReduxStateType } from "@/app/store/types";
const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  createCategory: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  updateCategory: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  deleteCategory: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  filters: {
    search: "",
    isActive: undefined,
  },
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    // Saga triggers
    fetchCategoriesStart: (
      state,
      action: PayloadAction<{ page?: number; limit?: number; search?: string; isActive?: boolean }>
    ) => {
      state.isLoading = true;
      state.error = null;
      if (action.payload.page) state.pagination.page = action.payload.page;
      if (action.payload.search !== undefined) state.filters.search = action.payload.search;
      if (action.payload.isActive !== undefined) state.filters.isActive = action.payload.isActive;
    },
    fetchCategoriesSuccess: (
      state,
      action: PayloadAction<{ categories: Category[]; pagination: any }>
    ) => {
      state.isLoading = false;
      state.error = null;
      state.categories = action.payload.categories;
      state.pagination = action.payload.pagination;
    },
    fetchCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.categories = [];
    },

    createCategoryStart: (state, _action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
      state.createCategory.status = ReduxStateType.LOADING;
      state.createCategory.error = null;
      state.createCategory.message = null;
    },
    createCategorySuccess: (state, action: PayloadAction<Category>) => {
      state.isLoading = false;
      state.categories = [action.payload, ...state.categories];
      state.createCategory.status = ReduxStateType.SUCCESS;
      state.createCategory.error = null;
      state.createCategory.message = null;
    },
    createCategoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.createCategory.status = ReduxStateType.ERROR;
      state.createCategory.error = action.payload;
      state.createCategory.message = action.payload;
    },

    updateCategoryStart: (state, _action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
      state.updateCategory.status = ReduxStateType.LOADING;
      state.updateCategory.error = null;
      state.updateCategory.message = null;
    },
    updateCategorySuccess: (state, action: PayloadAction<Category>) => {
      state.isLoading = false;
      state.updateCategory.status = ReduxStateType.SUCCESS;
      state.updateCategory.error = null;
      state.updateCategory.message = null;
      const index = state.categories.findIndex((cat) => cat._id === action.payload._id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    updateCategoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.updateCategory.status = ReduxStateType.ERROR;
      state.updateCategory.error = action.payload;
      state.updateCategory.message = action.payload;
    },

    deleteCategoryStart: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
      state.deleteCategory.status = ReduxStateType.LOADING;
      state.deleteCategory.error = null;
      state.deleteCategory.message = null;
    },
    deleteCategorySuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.deleteCategory.status = ReduxStateType.SUCCESS;
      state.deleteCategory.error = null;
      state.deleteCategory.message = null;
      state.categories = state.categories.filter((cat) => cat._id !== action.payload);
    },
    deleteCategoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.deleteCategory.status = ReduxStateType.ERROR;
      state.deleteCategory.error = action.payload;
      state.deleteCategory.message = action.payload;
    },

    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
    // reset state
    resetState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.createCategory.status = ReduxStateType.INIT;
      state.createCategory.error = null;
      state.createCategory.message = null;
      state.updateCategory.status = ReduxStateType.INIT;
      state.updateCategory.error = null;
      state.updateCategory.message = null;
      state.deleteCategory.status = ReduxStateType.INIT;
      state.deleteCategory.error = null;
      state.deleteCategory.message = null;
    },
    resetCreateCategory: (state) => {
      state.createCategory.status = ReduxStateType.INIT;
      state.createCategory.error = null;
      state.createCategory.message = null;
    },
    resetUpdateCategory: (state) => {
      state.updateCategory.status = ReduxStateType.INIT;
      state.updateCategory.error = null;
      state.updateCategory.message = null;
    },
    resetDeleteCategory: (state) => {
      state.deleteCategory.status = ReduxStateType.INIT;
      state.deleteCategory.error = null;
      state.deleteCategory.message = null;
    },
  },
});

export const {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  createCategoryStart,
  createCategorySuccess,
  createCategoryFailure,
  updateCategoryStart,
  updateCategorySuccess,
  updateCategoryFailure,
  deleteCategoryStart,
  deleteCategorySuccess,
  deleteCategoryFailure,
  setSelectedCategory,
  clearError,
  resetState,
  resetCreateCategory,
  resetUpdateCategory,
  resetDeleteCategory,
} = categorySlice.actions;

export default categorySlice.reducer;
