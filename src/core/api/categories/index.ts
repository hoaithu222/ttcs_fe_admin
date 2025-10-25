import { CATEGORIES_ENDPOINTS, buildEndpoint } from "./path";
import type {
  Category,
  SubCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryListQuery,
  CategoryListResponse,
  SubCategoryListResponse,
  ApiSuccess,
} from "./type";
import { VpsHttpClient } from "@/core/base/http-client";

// Categories API service
class CategoriesApiService extends VpsHttpClient {
  constructor() {
    super(process.env.REACT_APP_API_BASE_URL || "");
  }

  // Get categories list
  async getCategories(query?: CategoryListQuery): Promise<ApiSuccess<CategoryListResponse>> {
    const response = await this.get(CATEGORIES_ENDPOINTS.LIST, { params: query });
    return response.data;
  }

  // Get category detail
  async getCategory(id: string): Promise<ApiSuccess<Category>> {
    const endpoint = buildEndpoint(CATEGORIES_ENDPOINTS.DETAIL, { id });
    const response = await this.get(endpoint);
    return response.data;
  }

  // Get sub-categories of a category
  async getSubCategories(
    categoryId: string,
    query?: CategoryListQuery
  ): Promise<ApiSuccess<SubCategoryListResponse>> {
    const endpoint = buildEndpoint(CATEGORIES_ENDPOINTS.SUB_CATEGORIES, { id: categoryId });
    const response = await this.get(endpoint, { params: query });
    return response.data;
  }

  // Create new category
  async createCategory(data: CreateCategoryRequest): Promise<ApiSuccess<Category>> {
    const response = await this.post(CATEGORIES_ENDPOINTS.CREATE, data);
    return response.data;
  }

  // Update category
  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<ApiSuccess<Category>> {
    const endpoint = buildEndpoint(CATEGORIES_ENDPOINTS.UPDATE, { id });
    const response = await this.put(endpoint, data);
    return response.data;
  }

  // Delete category
  async deleteCategory(id: string): Promise<ApiSuccess<void>> {
    const endpoint = buildEndpoint(CATEGORIES_ENDPOINTS.DELETE, { id });
    const response = await this.delete(endpoint);
    return response.data;
  }
}

// Export singleton instance
export const categoriesApi = new CategoriesApiService();

// Export default
export default categoriesApi;
