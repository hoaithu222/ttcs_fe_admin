import { ATTRIBUTE_VALUES_ENDPOINTS, buildEndpoint } from "./path";
import type {
  AttributeValue,
  CreateAttributeValueRequest,
  UpdateAttributeValueRequest,
  BulkUpsertAttributeValuesRequest,
  AttributeValueListQuery,
  AttributeValueListResponse,
  ApiSuccess,
} from "./type";
import { VpsHttpClient } from "@/core/base/http-client";
import { API_BASE_URL } from "@/app/config/env.config";

// Attribute Values API service
class AttributeValuesApiService extends VpsHttpClient {
  constructor() {
    super(API_BASE_URL);
  }

  // Get attribute values list
  async getAttributeValues(
    query?: AttributeValueListQuery
  ): Promise<ApiSuccess<AttributeValueListResponse>> {
    const response = await this.get(ATTRIBUTE_VALUES_ENDPOINTS.LIST, { params: query });
    return response.data;
  }

  // Get attribute value detail
  async getAttributeValue(id: string): Promise<ApiSuccess<AttributeValue>> {
    const endpoint = buildEndpoint(ATTRIBUTE_VALUES_ENDPOINTS.DETAIL, { id });
    const response = await this.get(endpoint);
    return response.data;
  }

  // Create new attribute value
  async createAttributeValue(
    data: CreateAttributeValueRequest
  ): Promise<ApiSuccess<AttributeValue>> {
    const response = await this.post(ATTRIBUTE_VALUES_ENDPOINTS.CREATE, data);
    return response.data;
  }

  // Update attribute value
  async updateAttributeValue(
    id: string,
    data: UpdateAttributeValueRequest
  ): Promise<ApiSuccess<AttributeValue>> {
    const endpoint = buildEndpoint(ATTRIBUTE_VALUES_ENDPOINTS.UPDATE, { id });
    const response = await this.put(endpoint, data);
    return response.data;
  }

  // Delete attribute value
  async deleteAttributeValue(id: string): Promise<ApiSuccess<void>> {
    const endpoint = buildEndpoint(ATTRIBUTE_VALUES_ENDPOINTS.DELETE, { id });
    const response = await this.delete(endpoint);
    return response.data;
  }

  // Bulk upsert attribute values
  async bulkUpsertAttributeValues(
    data: BulkUpsertAttributeValuesRequest
  ): Promise<ApiSuccess<AttributeValueListResponse>> {
    const response = await this.post(ATTRIBUTE_VALUES_ENDPOINTS.BULK_UPSERT, data);
    return response.data;
  }
}

// Export singleton instance
export const attributeValuesApi = new AttributeValuesApiService();

// Export default
export default attributeValuesApi;
