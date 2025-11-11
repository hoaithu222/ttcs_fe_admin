import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubCategory } from "@/core/api/sub-categories/type";
import { ReduxStateType } from "@/app/store/types";
import { SubCategoryState, FetchSubCategoriesPayload } from "./subCategory.type";

const initialState: SubCategoryState = {
  subCategories: [],
  selectedSubCategory: null,
  isLoading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  createSubCategory: { status: ReduxStateType.INIT, error: null, message: null },
  updateSubCategory: { status: ReduxStateType.INIT, error: null, message: null },
  deleteSubCategory: { status: ReduxStateType.INIT, error: null, message: null },
  filters: { search: "", isActive: undefined, parentId: undefined },
};

const subCategorySlice = createSlice({
  name: "subCategory",
  initialState,
  reducers: {
    fetchSubCategoriesStart: (state, action: PayloadAction<FetchSubCategoriesPayload>) => {
      state.isLoading = true;
      state.error = null;
      // defensive init for persisted states missing nested objects
      if (!state.pagination) {
        state.pagination = { page: 1, limit: 10, total: 0, totalPages: 0 } as any;
      }
      if (!state.filters) {
        state.filters = { search: "", isActive: undefined, parentId: undefined } as any;
      }
      if (action.payload.page !== undefined) state.pagination.page = action.payload.page;
      if (action.payload.search !== undefined) state.filters.search = action.payload.search;
      if (action.payload.isActive !== undefined) state.filters.isActive = action.payload.isActive;
      if (action.payload.parentId !== undefined) state.filters.parentId = action.payload.parentId;
    },
    fetchSubCategoriesSuccess: (
      state,
      action: PayloadAction<{ subCategories: SubCategory[]; pagination: any }>
    ) => {
      state.isLoading = false;
      state.error = null;
      state.subCategories = action.payload.subCategories;
      console.log(state.subCategories, "state.subCategories");
      state.pagination = action.payload.pagination;
    },
    fetchSubCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.subCategories = [];
    },

    createSubCategoryStart: (state, _action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
      state.createSubCategory.status = ReduxStateType.LOADING;
      state.createSubCategory.error = null;
      state.createSubCategory.message = null;
    },
    createSubCategorySuccess: (state, action: PayloadAction<SubCategory>) => {
      state.isLoading = false;
      state.subCategories = [action.payload, ...state.subCategories];
      state.createSubCategory.status = ReduxStateType.SUCCESS;
      state.createSubCategory.error = null;
      state.createSubCategory.message = null;
    },
    createSubCategoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.createSubCategory.status = ReduxStateType.ERROR;
      state.createSubCategory.error = action.payload;
      state.createSubCategory.message = action.payload;
    },

    updateSubCategoryStart: (state, _action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
      state.updateSubCategory.status = ReduxStateType.LOADING;
      state.updateSubCategory.error = null;
      state.updateSubCategory.message = null;
    },
    updateSubCategorySuccess: (state, action: PayloadAction<SubCategory>) => {
      state.isLoading = false;
      state.updateSubCategory.status = ReduxStateType.SUCCESS;
      state.updateSubCategory.error = null;
      state.updateSubCategory.message = null;
      const index = state.subCategories.findIndex((it) => it._id === action.payload._id);
      if (index !== -1) state.subCategories[index] = action.payload;
    },
    updateSubCategoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.updateSubCategory.status = ReduxStateType.ERROR;
      state.updateSubCategory.error = action.payload;
      state.updateSubCategory.message = action.payload;
    },

    deleteSubCategoryStart: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
      state.deleteSubCategory.status = ReduxStateType.LOADING;
      state.deleteSubCategory.error = null;
      state.deleteSubCategory.message = null;
    },
    deleteSubCategorySuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.deleteSubCategory.status = ReduxStateType.SUCCESS;
      state.deleteSubCategory.error = null;
      state.deleteSubCategory.message = null;
      state.subCategories = state.subCategories.filter((it) => it._id !== action.payload);
    },
    deleteSubCategoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.deleteSubCategory.status = ReduxStateType.ERROR;
      state.deleteSubCategory.error = action.payload;
      state.deleteSubCategory.message = action.payload;
    },

    setSelectedSubCategory: (state, action: PayloadAction<SubCategory | null>) => {
      state.selectedSubCategory = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.createSubCategory.status = ReduxStateType.INIT;
      state.createSubCategory.error = null;
      state.createSubCategory.message = null;
      state.updateSubCategory.status = ReduxStateType.INIT;
      state.updateSubCategory.error = null;
      state.updateSubCategory.message = null;
      state.deleteSubCategory.status = ReduxStateType.INIT;
      state.deleteSubCategory.error = null;
      state.deleteSubCategory.message = null;
    },
  },
});

export const {
  fetchSubCategoriesStart,
  fetchSubCategoriesSuccess,
  fetchSubCategoriesFailure,
  createSubCategoryStart,
  createSubCategorySuccess,
  createSubCategoryFailure,
  updateSubCategoryStart,
  updateSubCategorySuccess,
  updateSubCategoryFailure,
  deleteSubCategoryStart,
  deleteSubCategorySuccess,
  deleteSubCategoryFailure,
  setSelectedSubCategory,
  clearError,
  resetState,
} = subCategorySlice.actions;

export default subCategorySlice.reducer;
