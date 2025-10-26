import { PRODUCTS_ENDPOINTS, buildEndpoint } from "./path";
import type {
  CreateProductRequest,
  UpdateProductRequest,
  ProductsQueryParams,
  Product,
  ProductsListResponse,
  ApiSuccess,
} from "./type";
import { VpsHttpClient } from "@/core/base/http-client";
import { API_BASE_URL } from "@/app/config/env.config";

// Products API service
class ProductsApiService extends VpsHttpClient {
  constructor() {
    super(API_BASE_URL);
  }

  // Get products list with query parameters
  async getProducts(params?: ProductsQueryParams): Promise<ApiSuccess<ProductsListResponse>> {
    const response = await this.get(PRODUCTS_ENDPOINTS.LIST, { params });
    return response.data;
  }

  // Get product by ID
  async getProduct(id: string): Promise<ApiSuccess<Product>> {
    const endpoint = buildEndpoint(PRODUCTS_ENDPOINTS.DETAIL, { id });
    const response = await this.get(endpoint);
    return response.data;
  }

  // Create new product
  async createProduct(productData: CreateProductRequest): Promise<ApiSuccess<Product>> {
    const response = await this.post(PRODUCTS_ENDPOINTS.CREATE, productData);
    return response.data;
  }

  // Update product
  async updateProduct(id: string, productData: UpdateProductRequest): Promise<ApiSuccess<Product>> {
    const endpoint = buildEndpoint(PRODUCTS_ENDPOINTS.UPDATE, { id });
    const response = await this.put(endpoint, productData);
    return response.data;
  }

  // Delete product
  async deleteProduct(id: string): Promise<ApiSuccess<void>> {
    const endpoint = buildEndpoint(PRODUCTS_ENDPOINTS.DELETE, { id });
    const response = await this.delete(endpoint);
    return response.data;
  }

  // Search products
  async searchProducts(
    query: string,
    params?: Omit<ProductsQueryParams, "search">
  ): Promise<ApiSuccess<ProductsListResponse>> {
    const response = await this.get(PRODUCTS_ENDPOINTS.SEARCH, {
      params: { ...params, search: query },
    });
    return response.data;
  }

  // Get categories
  async getCategories(): Promise<ApiSuccess<any[]>> {
    const response = await this.get(PRODUCTS_ENDPOINTS.CATEGORIES);
    return response.data;
  }

  // Get subcategories
  async getSubcategories(categoryId?: string): Promise<ApiSuccess<any[]>> {
    const response = await this.get(PRODUCTS_ENDPOINTS.SUBCATEGORIES, {
      params: categoryId ? { categoryId } : undefined,
    });
    return response.data;
  }

  // Get shops
  async getShops(): Promise<ApiSuccess<any[]>> {
    const response = await this.get(PRODUCTS_ENDPOINTS.SHOPS);
    return response.data;
  }
}

// Export singleton instance
export const productsApi = new ProductsApiService();

// Export default
export default productsApi;
