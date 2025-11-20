// Attribute Value types
export interface AttributeValue {
  _id: string;
  attributeTypeId: string;
  value: string;
  label?: string;
  colorCode?: string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Request types
export interface CreateAttributeValueRequest {
  attributeTypeId: string;
  value: string;
  label?: string;
  colorCode?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateAttributeValueRequest extends Partial<CreateAttributeValueRequest> {
  _id: string;
}

export interface BulkUpsertAttributeValueItem {
  _id?: string;
  value: string;
  label: string;
  colorCode?: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface BulkUpsertAttributeValuesRequest {
  attributeTypeId: string;
  items: BulkUpsertAttributeValueItem[];
}

export interface AttributeValueListQuery {
  page?: number;
  limit?: number;
  search?: string;
  attributeTypeId?: string;
}

// Response types
export interface AttributeValueListResponse {
  attributeValues: AttributeValue[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API response wrapper
export interface ApiSuccess<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: any;
  timestamp: string;
  code: number;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  timestamp: string;
  path: string;
  method: string;
  code: number;
}
