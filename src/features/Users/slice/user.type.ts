import { User } from "@/core/api/users/type";
import { ReduxStateType } from "@/app/store/types";

export interface UserState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  // trường hợp thêm
  createUser: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  // trường hợp cập nhật
  updateUser: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  // trường hợp xóa
  deleteUser: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  // trường hợp khóa
  suspendUser: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  // trường hợp mở khóa
  unlockUser: {
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
    role: string | undefined;
  };
}

export interface FetchUsersPayload {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "suspended";
  role?: "admin" | "user" | "moderator";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  avatar?: string;
  status?: "active" | "inactive" | "suspended";
  role?: "admin" | "user" | "moderator";
}

export interface UpdateUserPayload {
  id: string;
  data: {
    name?: string;
    email?: string;
    avatar?: string;
    phone?: string;
    status?: "active" | "inactive" | "suspended";
    role?: "admin" | "user" | "moderator";
  };
}

export interface DeleteUserPayload {
  id: string;
}

export interface SuspendUserPayload {
  id: string;
}

export interface UnlockUserPayload {
  id: string;
}

export interface UpdateUserRolePayload {
  id: string;
  role: "admin" | "user" | "moderator";
}
