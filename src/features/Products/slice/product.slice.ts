import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductState } from "./product.type";
import { Product } from "@/core/api/products/type";
import { ReduxStateType } from "@/app/store/types";

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  createProduct: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  updateProduct: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  updateProductStatus: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  deleteProduct: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  filters: {
    search: "",
    status: undefined,
  },
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // Fetch Products
    fetchProductsStart: (
      state,
      action: PayloadAction<{ page?: number; limit?: number; search?: string; status?: "approved" | "hidden" | "violated" }>
    ) => {
      state.isLoading = true;
      state.error = null;
      if (action.payload.page) state.pagination.page = action.payload.page;
      if (action.payload.search !== undefined) state.filters.search = action.payload.search;
      if (action.payload.status !== undefined) state.filters.status = action.payload.status;
    },
    fetchProductsSuccess: (
      state,
      action: PayloadAction<{ products: Product[]; pagination: any }>
    ) => {
      console.log("=== fetchProductsSuccess reducer ===");
      console.log("Payload:", action.payload);
      state.isLoading = false;
      state.error = null;
      state.products = action.payload.products;
      state.pagination = action.payload.pagination;
      console.log("Updated pagination state:", state.pagination);
    },
    fetchProductsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.products = [];
    },

    // Create Product
    createProductStart: (state, _action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
      state.createProduct.status = ReduxStateType.LOADING;
      state.createProduct.error = null;
      state.createProduct.message = null;
    },
    createProductSuccess: (state, action: PayloadAction<Product>) => {
      state.isLoading = false;
      state.products = [action.payload, ...state.products];
      state.createProduct.status = ReduxStateType.SUCCESS;
      state.createProduct.error = null;
      state.createProduct.message = null;
    },
    createProductFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.createProduct.status = ReduxStateType.ERROR;
      state.createProduct.error = action.payload;
      state.createProduct.message = action.payload;
    },

    // Update Product
    updateProductStart: (state, _action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
      state.updateProduct.status = ReduxStateType.LOADING;
      state.updateProduct.error = null;
      state.updateProduct.message = null;
    },
    updateProductSuccess: (state, action: PayloadAction<Product>) => {
      state.isLoading = false;
      state.updateProduct.status = ReduxStateType.SUCCESS;
      state.updateProduct.error = null;
      state.updateProduct.message = null;
      const index = state.products.findIndex((prod) => prod._id === action.payload._id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    updateProductFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.updateProduct.status = ReduxStateType.ERROR;
      state.updateProduct.error = action.payload;
      state.updateProduct.message = action.payload;
    },

    // Update Product Status
    updateProductStatusStart: (state, _action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
      state.updateProductStatus.status = ReduxStateType.LOADING;
      state.updateProductStatus.error = null;
      state.updateProductStatus.message = null;
    },
    updateProductStatusSuccess: (state, action: PayloadAction<Product>) => {
      state.isLoading = false;
      state.updateProductStatus.status = ReduxStateType.SUCCESS;
      state.updateProductStatus.error = null;
      state.updateProductStatus.message = null;
      const index = state.products.findIndex((prod) => prod._id === action.payload._id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    updateProductStatusFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.updateProductStatus.status = ReduxStateType.ERROR;
      state.updateProductStatus.error = action.payload;
      state.updateProductStatus.message = action.payload;
    },

    // Delete Product
    deleteProductStart: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
      state.deleteProduct.status = ReduxStateType.LOADING;
      state.deleteProduct.error = null;
      state.deleteProduct.message = null;
    },
    deleteProductSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.deleteProduct.status = ReduxStateType.SUCCESS;
      state.deleteProduct.error = null;
      state.deleteProduct.message = null;
      state.products = state.products.filter((prod) => prod._id !== action.payload);
    },
    deleteProductFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.deleteProduct.status = ReduxStateType.ERROR;
      state.deleteProduct.error = action.payload;
      state.deleteProduct.message = action.payload;
    },

    // Select Product
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },

    // Clear Error
    clearError: (state) => {
      state.error = null;
    },

    // Reset State
    resetState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.createProduct.status = ReduxStateType.INIT;
      state.createProduct.error = null;
      state.createProduct.message = null;
      state.updateProduct.status = ReduxStateType.INIT;
      state.updateProduct.error = null;
      state.updateProduct.message = null;
      state.updateProductStatus.status = ReduxStateType.INIT;
      state.updateProductStatus.error = null;
      state.updateProductStatus.message = null;
      state.deleteProduct.status = ReduxStateType.INIT;
      state.deleteProduct.error = null;
      state.deleteProduct.message = null;
    },
    resetCreateProduct: (state) => {
      state.createProduct.status = ReduxStateType.INIT;
      state.createProduct.error = null;
      state.createProduct.message = null;
    },
    resetUpdateProduct: (state) => {
      state.updateProduct.status = ReduxStateType.INIT;
      state.updateProduct.error = null;
      state.updateProduct.message = null;
    },
    resetUpdateProductStatus: (state) => {
      state.updateProductStatus.status = ReduxStateType.INIT;
      state.updateProductStatus.error = null;
      state.updateProductStatus.message = null;
    },
    resetDeleteProduct: (state) => {
      state.deleteProduct.status = ReduxStateType.INIT;
      state.deleteProduct.error = null;
      state.deleteProduct.message = null;
    },
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  createProductStart,
  createProductSuccess,
  createProductFailure,
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
  updateProductStatusStart,
  updateProductStatusSuccess,
  updateProductStatusFailure,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
  setSelectedProduct,
  clearError,
  resetState,
  resetCreateProduct,
  resetUpdateProduct,
  resetUpdateProductStatus,
  resetDeleteProduct,
} = productSlice.actions;

export default productSlice.reducer;
