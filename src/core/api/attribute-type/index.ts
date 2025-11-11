import { ATTRIBUTE_TYPES_ENDPOINTS, buildEndpoint } from "./path";
import type {
  AttributeType,
  CreateAttributeTypeRequest,
  UpdateAttributeTypeRequest,
  AttributeTypeListQuery,
  AttributeTypeListResponse,
  ApiSuccess,
} from "./type";
import { VpsHttpClient } from "@/core/base/http-client";
import { API_BASE_URL } from "@/app/config/env.config";

// Attribute Types API service
class AttributeTypesApiService extends VpsHttpClient {
  constructor() {
    super(API_BASE_URL);
  }

  // Get attribute types list
  async getAttributeTypes(
    query?: AttributeTypeListQuery
  ): Promise<ApiSuccess<AttributeTypeListResponse>> {
    const response = await this.get(ATTRIBUTE_TYPES_ENDPOINTS.LIST, { params: query });
    return response.data;
  }

  // Get attribute type detail
  async getAttributeType(id: string): Promise<ApiSuccess<AttributeType>> {
    const endpoint = buildEndpoint(ATTRIBUTE_TYPES_ENDPOINTS.DETAIL, { id });
    const response = await this.get(endpoint);
    return response.data;
  }

  // Create new attribute type
  async createAttributeType(data: CreateAttributeTypeRequest): Promise<ApiSuccess<AttributeType>> {
    const response = await this.post(ATTRIBUTE_TYPES_ENDPOINTS.CREATE, data);
    return response.data;
  }

  // Update attribute type
  async updateAttributeType(
    id: string,
    data: UpdateAttributeTypeRequest
  ): Promise<ApiSuccess<AttributeType>> {
    const endpoint = buildEndpoint(ATTRIBUTE_TYPES_ENDPOINTS.UPDATE, { id });
    const response = await this.put(endpoint, data);
    return response.data;
  }

  // Delete attribute type
  async deleteAttributeType(id: string): Promise<ApiSuccess<void>> {
    const endpoint = buildEndpoint(ATTRIBUTE_TYPES_ENDPOINTS.DELETE, { id });
    const response = await this.delete(endpoint);
    return response.data;
  }

  // Restore deleted attribute type
  async restoreAttributeType(id: string): Promise<ApiSuccess<AttributeType>> {
    const endpoint = buildEndpoint(ATTRIBUTE_TYPES_ENDPOINTS.RESTORE, { id });
    const response = await this.post(endpoint);
    return response.data;
  }
}

// Export singleton instance
export const attributeTypesApi = new AttributeTypesApiService();

// Export default
export default attributeTypesApi;

