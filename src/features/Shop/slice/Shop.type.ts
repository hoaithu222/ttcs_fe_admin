import { Shop } from "@/core/api/shops/type";
import { ReduxStateType } from "@/app/store/types";

export interface ShopState {
  shops: Shop[];
  selectedShop: Shop | null;
  isLoading: boolean;
  error: string | null;
  // trường hợp thêm
  createShop: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  // trường hợp cập nhật
  updateShop: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  // trường hợp xóa
  deleteShop: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  // trường hợp duyệt
  approveShop: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  // trường hợp từ chối
  rejectShop: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  // trường hợp khóa
  suspendShop: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  // trường hợp mở khóa
  unlockShop: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    search: string;
    status: string | undefined;
    isActive: boolean | undefined;
    isVerified: boolean | undefined;
  };
}

export interface FetchShopsPayload {
  page?: number;
  limit?: number;
  search?: string;
  status?: "pending" | "active" | "blocked";
  isActive?: boolean;
  isVerified?: boolean;
}

export interface CreateShopPayload {
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive?: boolean;
}

export interface UpdateShopPayload {
  id: string;
  data: {
    name?: string;
    description?: string;
    logo?: string;
    coverImage?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    isActive?: boolean;
    isVerified?: boolean;
  };
}

export interface DeleteShopPayload {
  id: string;
}

export interface ApproveShopPayload {
  id: string;
}

export interface RejectShopPayload {
  id: string;
}

export interface SuspendShopPayload {
  id: string;
}

export interface UnlockShopPayload {
  id: string;
}
