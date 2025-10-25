import { REVIEWS_ENDPOINTS, buildEndpoint } from "./path";
import type {
  Review,
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewListQuery,
  ReviewListResponse,
  ApiSuccess,
} from "./type";
import { VpsHttpClient } from "@/core/base/http-client";

// Reviews API service
class ReviewsApiService extends VpsHttpClient {
  constructor() {
    super(process.env.REACT_APP_API_BASE_URL || "");
  }

  // Get product reviews
  async getProductReviews(
    productId: string,
    query?: ReviewListQuery
  ): Promise<ApiSuccess<ReviewListResponse>> {
    const endpoint = buildEndpoint(REVIEWS_ENDPOINTS.PRODUCT_REVIEWS, { productId });
    const response = await this.get(endpoint, { params: query });
    return response.data;
  }

  // Create review for product
  async createReview(productId: string, data: CreateReviewRequest): Promise<ApiSuccess<Review>> {
    const endpoint = buildEndpoint(REVIEWS_ENDPOINTS.CREATE_REVIEW, { productId });
    const response = await this.post(endpoint, data);
    return response.data;
  }

  // Update review
  async updateReview(reviewId: string, data: UpdateReviewRequest): Promise<ApiSuccess<Review>> {
    const endpoint = buildEndpoint(REVIEWS_ENDPOINTS.UPDATE_REVIEW, { reviewId });
    const response = await this.put(endpoint, data);
    return response.data;
  }

  // Delete review
  async deleteReview(reviewId: string): Promise<ApiSuccess<void>> {
    const endpoint = buildEndpoint(REVIEWS_ENDPOINTS.DELETE_REVIEW, { reviewId });
    const response = await this.delete(endpoint);
    return response.data;
  }

  // Get user reviews
  async getUserReviews(query?: ReviewListQuery): Promise<ApiSuccess<ReviewListResponse>> {
    const response = await this.get(REVIEWS_ENDPOINTS.USER_REVIEWS, { params: query });
    return response.data;
  }
}

// Export singleton instance
export const reviewsApi = new ReviewsApiService();

// Export default
export default reviewsApi;
