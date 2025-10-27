import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";

const categoryState = (state: RootState) => state.category;

export const selectCategories = createSelector([categoryState], (category) => category.categories);

export const selectSelectedCategory = createSelector(
  [categoryState],
  (category) => category.selectedCategory
);

export const selectCategoryLoading = createSelector(
  [categoryState],
  (category) => category.isLoading
);

export const selectCategoryError = createSelector([categoryState], (category) => category.error);

export const selectCategoryPagination = createSelector(
  [categoryState],
  (category) => category.pagination
);

export const selectCategoryFilters = createSelector(
  [categoryState],
  (category) => category.filters
);

export const selectCreateCategoryStatus = createSelector(
  [categoryState],
  (category) => category.createCategory.status
);

export const selectUpdateCategoryStatus = createSelector(
  [categoryState],
  (category) => category.updateCategory.status
);

export const selectDeleteCategoryStatus = createSelector(
  [categoryState],
  (category) => category.deleteCategory.status
);

export const selectCreateCategoryError = createSelector(
  [categoryState],
  (category) => category.createCategory.error
);

export const selectUpdateCategoryError = createSelector(
  [categoryState],
  (category) => category.updateCategory.error
);
