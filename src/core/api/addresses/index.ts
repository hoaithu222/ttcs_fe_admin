import { ADDRESSES_ENDPOINTS, buildEndpoint } from "./path";
import type {
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
  AddressListQuery,
  AddressListResponse,
  ApiSuccess,
} from "./type";
import { VpsHttpClient } from "@/core/base/http-client";

// Addresses API service
class AddressesApiService extends VpsHttpClient {
  constructor() {
    super(process.env.REACT_APP_API_BASE_URL || "");
  }

  // Get addresses list
  async getAddresses(query?: AddressListQuery): Promise<ApiSuccess<AddressListResponse>> {
    const response = await this.get(ADDRESSES_ENDPOINTS.LIST, { params: query });
    return response.data;
  }

  // Get address detail
  async getAddress(id: string): Promise<ApiSuccess<Address>> {
    const endpoint = buildEndpoint(ADDRESSES_ENDPOINTS.DETAIL, { id });
    const response = await this.get(endpoint);
    return response.data;
  }

  // Create new address
  async createAddress(data: CreateAddressRequest): Promise<ApiSuccess<Address>> {
    const response = await this.post(ADDRESSES_ENDPOINTS.CREATE, data);
    return response.data;
  }

  // Update address
  async updateAddress(id: string, data: UpdateAddressRequest): Promise<ApiSuccess<Address>> {
    const endpoint = buildEndpoint(ADDRESSES_ENDPOINTS.UPDATE, { id });
    const response = await this.put(endpoint, data);
    return response.data;
  }

  // Delete address
  async deleteAddress(id: string): Promise<ApiSuccess<void>> {
    const endpoint = buildEndpoint(ADDRESSES_ENDPOINTS.DELETE, { id });
    const response = await this.delete(endpoint);
    return response.data;
  }

  // Set address as default
  async setDefaultAddress(id: string): Promise<ApiSuccess<Address>> {
    const endpoint = buildEndpoint(ADDRESSES_ENDPOINTS.SET_DEFAULT, { id });
    const response = await this.post(endpoint);
    return response.data;
  }
}

// Export singleton instance
export const addressesApi = new AddressesApiService();

// Export default
export default addressesApi;
