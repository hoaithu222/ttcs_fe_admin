import { CART_ENDPOINTS, buildEndpoint } from "./path";
import type {
  Cart,
  AddCartItemRequest,
  UpdateCartItemRequest,
  CartResponse,
  ApiSuccess,
} from "./type";
import { VpsHttpClient } from "@/core/base/http-client";
import { API_BASE_URL } from "@/app/config/env.config";

// Cart API service
class CartApiService extends VpsHttpClient {
  constructor() {
    super(API_BASE_URL);
  }

  // Get current cart
  async getCart(): Promise<ApiSuccess<CartResponse>> {
    const response = await this.get(CART_ENDPOINTS.GET);
    return response.data;
  }

  // Add item to cart
  async addItem(data: AddCartItemRequest): Promise<ApiSuccess<CartResponse>> {
    const response = await this.post(CART_ENDPOINTS.ADD_ITEM, data);
    return response.data;
  }

  // Update cart item quantity
  async updateItem(itemId: string, data: UpdateCartItemRequest): Promise<ApiSuccess<CartResponse>> {
    const endpoint = buildEndpoint(CART_ENDPOINTS.UPDATE_ITEM, { itemId });
    const response = await this.put(endpoint, data);
    return response.data;
  }

  // Remove item from cart
  async removeItem(itemId: string): Promise<ApiSuccess<CartResponse>> {
    const endpoint = buildEndpoint(CART_ENDPOINTS.DELETE_ITEM, { itemId });
    const response = await this.delete(endpoint);
    return response.data;
  }

  // Clear entire cart
  async clearCart(): Promise<ApiSuccess<void>> {
    const response = await this.delete(CART_ENDPOINTS.CLEAR);
    return response.data;
  }
}

// Export singleton instance
export const cartApi = new CartApiService();

// Export default
export default cartApi;
