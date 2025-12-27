import { Product, ProductListQuery } from "@/core/api/products/type";
import { ReduxStateType } from "@/app/store/types";

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  // trường hợp thêm
  createProduct: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  // trường hợp cập nhật
  updateProduct: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  // trường hợp thay đổi trạng thái
  updateProductStatus: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  // trường hợp xóa
  deleteProduct: {
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
    status?: "approved" | "hidden" | "violated";
  };
}

export interface FetchProductsPayload extends ProductListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: "approved" | "hidden" | "violated";
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  quantity?: number;
  [key: string]: any;
}

export interface UpdateProductPayload {
  id: string;
  data: Partial<Product>;
}

export interface UpdateProductStatusPayload {
  id: string;
  status: "approved" | "hidden" | "violated";
  violationNote?: string;
}
