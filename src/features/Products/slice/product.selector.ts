import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";

const productState = (state: RootState) => state.product;

export const selectProducts = createSelector([productState], (product) => product.products);

export const selectSelectedProduct = createSelector(
  [productState],
  (product) => product.selectedProduct
);

export const selectProductLoading = createSelector(
  [productState],
  (product) => product.isLoading
);

export const selectProductError = createSelector([productState], (product) => product.error);

export const selectProductPagination = createSelector(
  [productState],
  (product) => product.pagination
);

export const selectProductFilters = createSelector(
  [productState],
  (product) => product.filters
);

export const selectCreateProductStatus = createSelector(
  [productState],
  (product) => product.createProduct.status
);

export const selectUpdateProductStatus = createSelector(
  [productState],
  (product) => product.updateProduct.status
);

export const selectUpdateProductStatusStatus = createSelector(
  [productState],
  (product) => product.updateProductStatus.status
);

export const selectDeleteProductStatus = createSelector(
  [productState],
  (product) => product.deleteProduct.status
);

export const selectCreateProductError = createSelector(
  [productState],
  (product) => product.createProduct.error
);

export const selectUpdateProductError = createSelector(
  [productState],
  (product) => product.updateProduct.error
);

export const selectUpdateProductStatusError = createSelector(
  [productState],
  (product) => product.updateProductStatus.error
);

export const selectDeleteProductError = createSelector(
  [productState],
  (product) => product.deleteProduct.error
);
