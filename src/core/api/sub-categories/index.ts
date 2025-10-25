import { SUB_CATEGORIES_ENDPOINTS, buildEndpoint } from "./path";
import type {
  SubCategory,
  CreateSubCategoryRequest,
  UpdateSubCategoryRequest,
  SubCategoryListQuery,
  SubCategoryListResponse,
  ApiSuccess,
} from "./type";
import { VpsHttpClient } from "@/core/base/http-client";

// Sub Categories API service
class SubCategoriesApiService extends VpsHttpClient {
  constructor() {
    super(process.env.REACT_APP_API_BASE_URL || "");
  }

  // Get sub-categories list
  async getSubCategories(
    query?: SubCategoryListQuery
  ): Promise<ApiSuccess<SubCategoryListResponse>> {
    const response = await this.get(SUB_CATEGORIES_ENDPOINTS.LIST, { params: query });
    return response.data;
  }

  // Get sub-category detail
  async getSubCategory(id: string): Promise<ApiSuccess<SubCategory>> {
    const endpoint = buildEndpoint(SUB_CATEGORIES_ENDPOINTS.DETAIL, { id });
    const response = await this.get(endpoint);
    return response.data;
  }

  // Create new sub-category
  async createSubCategory(data: CreateSubCategoryRequest): Promise<ApiSuccess<SubCategory>> {
    const response = await this.post(SUB_CATEGORIES_ENDPOINTS.CREATE, data);
    return response.data;
  }

  // Update sub-category
  async updateSubCategory(
    id: string,
    data: UpdateSubCategoryRequest
  ): Promise<ApiSuccess<SubCategory>> {
    const endpoint = buildEndpoint(SUB_CATEGORIES_ENDPOINTS.UPDATE, { id });
    const response = await this.put(endpoint, data);
    return response.data;
  }

  // Delete sub-category
  async deleteSubCategory(id: string): Promise<ApiSuccess<void>> {
    const endpoint = buildEndpoint(SUB_CATEGORIES_ENDPOINTS.DELETE, { id });
    const response = await this.delete(endpoint);
    return response.data;
  }
}

// Export singleton instance
export const subCategoriesApi = new SubCategoriesApiService();

// Export default
export default subCategoriesApi;
