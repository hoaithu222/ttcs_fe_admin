import { HOME_ENDPOINTS } from "./path";
import type {
  BannerResponse,
  HomeCategoriesResponse,
  HomeProductsResponse,
  HomeShopsResponse,
  HomeQuery,
  SearchSuggestionQuery,
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
}

// Export singleton instance
export const homeApi = new HomeApiService();

// Export default
export default homeApi;

