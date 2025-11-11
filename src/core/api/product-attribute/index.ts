import { PRODUCT_ATTRIBUTES_ENDPOINTS, buildEndpoint } from "./path";
import type {
  ProductAttribute,
  CreateProductAttributeRequest,
  UpdateProductAttributeRequest,
  BulkAssignProductAttributesRequest,
  ProductAttributeListQuery,
  ProductAttributeListResponse,
  ApiSuccess,
} from "./type";
import { VpsHttpClient } from "@/core/base/http-client";
import { API_BASE_URL } from "@/app/config/env.config";

// Product Attributes API service
class ProductAttributesApiService extends VpsHttpClient {
  constructor() {
    super(API_BASE_URL);
  }

  // Get product attributes list
  async getProductAttributes(
    query?: ProductAttributeListQuery
  ): Promise<ApiSuccess<ProductAttributeListResponse>> {
    const response = await this.get(PRODUCT_ATTRIBUTES_ENDPOINTS.LIST, { params: query });
    return response.data;
  }

  // Get product attribute detail
  async getProductAttribute(id: string): Promise<ApiSuccess<ProductAttribute>> {
    const endpoint = buildEndpoint(PRODUCT_ATTRIBUTES_ENDPOINTS.DETAIL, { id });
    const response = await this.get(endpoint);
    return response.data;
  }

  // Create new product attribute
  async createProductAttribute(
    data: CreateProductAttributeRequest
  ): Promise<ApiSuccess<ProductAttribute>> {
    const response = await this.post(PRODUCT_ATTRIBUTES_ENDPOINTS.CREATE, data);
    return response.data;
  }

  // Update product attribute
  async updateProductAttribute(
    id: string,
    data: UpdateProductAttributeRequest
  ): Promise<ApiSuccess<ProductAttribute>> {
    const endpoint = buildEndpoint(PRODUCT_ATTRIBUTES_ENDPOINTS.UPDATE, { id });
    const response = await this.put(endpoint, data);
    return response.data;
  }

  // Delete product attribute
  async deleteProductAttribute(id: string): Promise<ApiSuccess<void>> {
    const endpoint = buildEndpoint(PRODUCT_ATTRIBUTES_ENDPOINTS.DELETE, { id });
    const response = await this.delete(endpoint);
    return response.data;
  }

  // Bulk assign product attributes
  async bulkAssignProductAttributes(
    data: BulkAssignProductAttributesRequest
  ): Promise<ApiSuccess<ProductAttributeListResponse>> {
    const response = await this.post(PRODUCT_ATTRIBUTES_ENDPOINTS.BULK_ASSIGN, data);
    return response.data;
  }
}

// Export singleton instance
export const productAttributesApi = new ProductAttributesApiService();

// Export default
export default productAttributesApi;

