import { PRODUCT_ENDPOINTS, PRODUCTS_ENDPOINTS, buildEndpoint } from "./path";
import type {
  Product,
  ProductListQuery,
  ProductListResponse,
  UpdateProductStatusRequest,
  ApiSuccess,
} from "./type";
import { VpsHttpClient } from "@/core/base/http-client";
import { API_BASE_URL } from "@/app/config/env.config";

// Product API service
class ProductApiService extends VpsHttpClient {
  constructor() {
    super(API_BASE_URL);
  }

  // Get product list
  async getProducts(query?: ProductListQuery): Promise<any> {
    const response = await this.get(PRODUCT_ENDPOINTS.LIST, { params: query });
    return response.data;
  }

  // Get single product
  async getProduct(id: string): Promise<ApiSuccess<Product>> {
    const endpoint = buildEndpoint(PRODUCT_ENDPOINTS.GET, { id });
    const response = await this.get(endpoint);
    return response.data;
  }

  // Update product status
  async updateProductStatus(
    id: string,
    data: UpdateProductStatusRequest
  ): Promise<ApiSuccess<Product>> {
    const endpoint = buildEndpoint(PRODUCT_ENDPOINTS.UPDATE_STATUS, { id });
    const response = await this.patch(endpoint, data);
    return response.data;
  }

  // Search products
  async searchProducts(query?: ProductListQuery): Promise<any> {
    const response = await this.get(PRODUCT_ENDPOINTS.SEARCH, { params: query });
    return response.data;
  }
}

// Export singleton instance
export const productsApi = new ProductApiService();
