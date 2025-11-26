// Attribute Type types
export interface AttributeType {
  _id: string;
  name: string;
  code: string;
  description?: string;
  categoryId?: string | { _id: string; name: string };
  categoryIds?: string[];
  categories?: Array<{ _id: string; name: string }>;
  isActive: boolean;
  is_multiple: boolean;
  inputType?: "text" | "number" | "select" | "multiselect" | "boolean" | "date" | "color";
  helperText?: string;
  isVariantAttribute?: boolean;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttributeValueItem {
  value: string;
  label?: string;
  colorCode?: string;
  sortOrder?: number;
  isActive?: boolean;
}

// Request types
export interface CreateAttributeTypeRequest {
  name: string;
  code?: string;
  description?: string;
  categoryId?: string;
  categoryIds?: string[];
  isActive?: boolean;
  is_multiple?: boolean;
  inputType?: AttributeType["inputType"];
  helperText?: string;
  values?: CreateAttributeValueItem[];
}

export interface UpdateAttributeTypeRequest extends Partial<CreateAttributeTypeRequest> {
  _id: string;
}

export interface AttributeTypeListQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  categoryId?: string;
}

// Response types
export interface AttributeTypeListResponse {
  attributeTypes: AttributeType[];
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
