// Cart types
export interface CartItem {
  _id: string;
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  discount?: number;
  totalPrice: number;
  addedAt: string;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  totalDiscount: number;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

// Request types
export interface AddCartItemRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// Response types
export interface CartResponse {
  cart: Cart;
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
