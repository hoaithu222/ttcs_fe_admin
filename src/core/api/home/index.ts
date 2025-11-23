import { HOME_ENDPOINTS, buildEndpoint } from "./path";
import type {
  BannerResponse,
  HomeCategoriesResponse,
  HomeProductsResponse,
  HomeShopsResponse,
  HomeQuery,
  SearchSuggestionQuery,
  HomeConfiguration,
  CreateHomeConfigurationRequest,
  UpdateHomeConfigurationRequest,
  ApiSuccess,
} from "./type";
import { VpsHttpClient } from "@/core/base/http-client";
import { API_BASE_URL } from "@/app/config/env.config";

// Home API service
class HomeApiService extends VpsHttpClient {
  constructor() {
    super(API_BASE_URL);
  }

  // Get banners
  async getBanners(): Promise<ApiSuccess<BannerResponse>> {
    const response = await this.get(HOME_ENDPOINTS.BANNER);
    return response.data;
  }

  // Get home categories
  async getHomeCategories(query?: HomeQuery): Promise<ApiSuccess<HomeCategoriesResponse>> {
    const response = await this.get(HOME_ENDPOINTS.CATEGORIES, { params: query });
    return response.data;
  }

  // Get best seller products
  async getBestSellerProducts(query?: HomeQuery): Promise<ApiSuccess<HomeProductsResponse>> {
    const response = await this.get(HOME_ENDPOINTS.BEST_SELLER, { params: query });
    return response.data;
  }

  // Get best shops
  async getBestShops(query?: HomeQuery): Promise<ApiSuccess<HomeShopsResponse>> {
    const response = await this.get(HOME_ENDPOINTS.BEST_SHOPS, { params: query });
    return response.data;
  }

  // Get flash sale products
  async getFlashSaleProducts(query?: HomeQuery): Promise<ApiSuccess<HomeProductsResponse>> {
    const response = await this.get(HOME_ENDPOINTS.FLASH_SALE, { params: query });
    return response.data;
  }

  // Get search suggestions
  async getSearchSuggestions(
    query: SearchSuggestionQuery
  ): Promise<ApiSuccess<HomeProductsResponse>> {
    const response = await this.get(HOME_ENDPOINTS.SEARCH_SUGGESTION, { params: query });
    return response.data;
  }

  // Home Configuration APIs (Admin only)
  
  // Get active configuration (public)
  async getActiveConfiguration(): Promise<ApiSuccess<HomeConfiguration>> {
    const response = await this.get(HOME_ENDPOINTS.CONFIGURATION);
    return response.data;
  }

  // Get all configurations (admin)
  async getAllConfigurations(): Promise<ApiSuccess<{ configurations: HomeConfiguration[] }>> {
    const response = await this.get(HOME_ENDPOINTS.ADMIN_CONFIGURATION);
    return response.data;
  }

  // Get configuration by ID (admin)
  async getConfigurationById(id: string): Promise<ApiSuccess<HomeConfiguration>> {
    const endpoint = buildEndpoint(HOME_ENDPOINTS.ADMIN_CONFIGURATION_DETAIL, { id });
    const response = await this.get(endpoint);
    return response.data;
  }

  // Create configuration (admin)
  async createConfiguration(
    data: CreateHomeConfigurationRequest
  ): Promise<ApiSuccess<HomeConfiguration>> {
    const response = await this.post(HOME_ENDPOINTS.ADMIN_CONFIGURATION, data);
    return response.data;
  }

  // Update configuration (admin)
  async updateConfiguration(
    id: string,
    data: UpdateHomeConfigurationRequest
  ): Promise<ApiSuccess<HomeConfiguration>> {
    const endpoint = buildEndpoint(HOME_ENDPOINTS.ADMIN_CONFIGURATION_DETAIL, { id });
    const response = await this.put(endpoint, data);
    return response.data;
  }

  // Delete configuration (admin)
  async deleteConfiguration(id: string): Promise<ApiSuccess<void>> {
    const endpoint = buildEndpoint(HOME_ENDPOINTS.ADMIN_CONFIGURATION_DETAIL, { id });
    const response = await this.delete(endpoint);
    return response.data;
  }
}

// Export singleton instance
export const homeApi = new HomeApiService();

// Export default
export default homeApi;

