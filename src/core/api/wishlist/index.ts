import { WISHLIST_ENDPOINTS, buildEndpoint } from "./path";
import type { Wishlist, AddToWishlistRequest, WishlistResponse, ApiSuccess } from "./type";
import { VpsHttpClient } from "@/core/base/http-client";

// Wishlist API service
class WishlistApiService extends VpsHttpClient {
  constructor() {
    super(process.env.REACT_APP_API_BASE_URL || "");
  }

  // Get wishlist
  async getWishlist(): Promise<ApiSuccess<WishlistResponse>> {
    const response = await this.get(WISHLIST_ENDPOINTS.LIST);
    return response.data;
  }

  // Add product to wishlist
  async addToWishlist(productId: string): Promise<ApiSuccess<WishlistResponse>> {
    const endpoint = buildEndpoint(WISHLIST_ENDPOINTS.ADD_ITEM, { productId });
    const response = await this.post(endpoint);
    return response.data;
  }

  // Remove product from wishlist
  async removeFromWishlist(productId: string): Promise<ApiSuccess<WishlistResponse>> {
    const endpoint = buildEndpoint(WISHLIST_ENDPOINTS.REMOVE_ITEM, { productId });
    const response = await this.delete(endpoint);
    return response.data;
  }

  // Clear entire wishlist
  async clearWishlist(): Promise<ApiSuccess<void>> {
    const response = await this.delete(WISHLIST_ENDPOINTS.CLEAR);
    return response.data;
  }
}

// Export singleton instance
export const wishlistApi = new WishlistApiService();

// Export default
export default wishlistApi;
