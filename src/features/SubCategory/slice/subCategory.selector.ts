import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";

const subCategoryState = (state: RootState) => state.subCategory;

export const selectSubCategories = createSelector(
  [subCategoryState],
  (state) => state.subCategories
);

export const selectSelectedSubCategory = createSelector(
  [subCategoryState],
  (state) => state.selectedSubCategory
);

export const selectSubCategoryLoading = createSelector(
  [subCategoryState],
  (state) => state.isLoading
);

export const selectSubCategoryError = createSelector(
  [subCategoryState],
  (state) => state.error
);

export const selectSubCategoryPagination = createSelector(
  [subCategoryState],
  (state) => state.pagination
);

export const selectSubCategoryFilters = createSelector(
  [subCategoryState],
  (state) => state.filters
);


