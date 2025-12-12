import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "./user.type";
import { User } from "@/core/api/users/type";
import { ReduxStateType } from "@/app/store/types";

const initialState: UserState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  createUser: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  updateUser: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  deleteUser: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  suspendUser: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  unlockUser: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  filters: {
    search: "",
    status: undefined,
    role: undefined,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Saga triggers
    fetchUsersStart: (
      state,
      action: PayloadAction<{
        page?: number;
        limit?: number;
        search?: string;
        status?: "active" | "inactive" | "suspended";
        role?: "admin" | "user" | "moderator";
        sortBy?: string;
        sortOrder?: "asc" | "desc";
      }>
    ) => {
      state.isLoading = true;
      state.error = null;
      if (action.payload.page) state.pagination.page = action.payload.page;
      if (action.payload.search !== undefined) state.filters.search = action.payload.search;
      if (action.payload.status !== undefined) state.filters.status = action.payload.status;
      if (action.payload.role !== undefined) state.filters.role = action.payload.role;
    },
    fetchUsersSuccess: (state, action: PayloadAction<{ users: User[]; pagination: any }>) => {
      state.isLoading = false;
      state.error = null;
      state.users = action.payload.users;
      state.pagination = action.payload.pagination;
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.users = [];
    },

    createUserStart: (state, _action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
      state.createUser.status = ReduxStateType.LOADING;
      state.createUser.error = null;
      state.createUser.message = null;
    },
    createUserSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.users = [action.payload, ...state.users];
      state.createUser.status = ReduxStateType.SUCCESS;
      state.createUser.error = null;
      state.createUser.message = null;
    },
    createUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.createUser.status = ReduxStateType.ERROR;
      state.createUser.error = action.payload;
      state.createUser.message = action.payload;
    },

    updateUserStart: (state, _action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
      state.updateUser.status = ReduxStateType.LOADING;
      state.updateUser.error = null;
      state.updateUser.message = null;
    },
    updateUserSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.updateUser.status = ReduxStateType.SUCCESS;
      state.updateUser.error = null;
      state.updateUser.message = null;
      const index = state.users.findIndex((user) => user._id === action.payload._id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.updateUser.status = ReduxStateType.ERROR;
      state.updateUser.error = action.payload;
      state.updateUser.message = action.payload;
    },

    deleteUserStart: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
      state.deleteUser.status = ReduxStateType.LOADING;
      state.deleteUser.error = null;
      state.deleteUser.message = null;
    },
    deleteUserSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.deleteUser.status = ReduxStateType.SUCCESS;
      state.deleteUser.error = null;
      state.deleteUser.message = null;
      state.users = state.users.filter((user) => user._id !== action.payload);
    },
    deleteUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.deleteUser.status = ReduxStateType.ERROR;
      state.deleteUser.error = action.payload;
      state.deleteUser.message = action.payload;
    },

    suspendUserStart: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
      state.suspendUser.status = ReduxStateType.LOADING;
      state.suspendUser.error = null;
      state.suspendUser.message = null;
    },
    suspendUserSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.suspendUser.status = ReduxStateType.SUCCESS;
      state.suspendUser.error = null;
      state.suspendUser.message = null;
      const index = state.users.findIndex((user) => user._id === action.payload._id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    suspendUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.suspendUser.status = ReduxStateType.ERROR;
      state.suspendUser.error = action.payload;
      state.suspendUser.message = action.payload;
    },

    unlockUserStart: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
      state.unlockUser.status = ReduxStateType.LOADING;
      state.unlockUser.error = null;
      state.unlockUser.message = null;
    },
    unlockUserSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.unlockUser.status = ReduxStateType.SUCCESS;
      state.unlockUser.error = null;
      state.unlockUser.message = null;
      const index = state.users.findIndex((user) => user._id === action.payload._id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    unlockUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.unlockUser.status = ReduxStateType.ERROR;
      state.unlockUser.error = action.payload;
      state.unlockUser.message = action.payload;
    },

    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
    // reset state
    resetState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.createUser.status = ReduxStateType.INIT;
      state.createUser.error = null;
      state.createUser.message = null;
      state.updateUser.status = ReduxStateType.INIT;
      state.updateUser.error = null;
      state.updateUser.message = null;
      state.deleteUser.status = ReduxStateType.INIT;
      state.deleteUser.error = null;
      state.deleteUser.message = null;
      state.suspendUser.status = ReduxStateType.INIT;
      state.suspendUser.error = null;
      state.suspendUser.message = null;
    },
    resetCreateUser: (state) => {
      state.createUser.status = ReduxStateType.INIT;
      state.createUser.error = null;
      state.createUser.message = null;
    },
    resetUpdateUser: (state) => {
      state.updateUser.status = ReduxStateType.INIT;
      state.updateUser.error = null;
      state.updateUser.message = null;
    },
    resetDeleteUser: (state) => {
      state.deleteUser.status = ReduxStateType.INIT;
      state.deleteUser.error = null;
      state.deleteUser.message = null;
    },
    resetSuspendUser: (state) => {
      state.suspendUser.status = ReduxStateType.INIT;
      state.suspendUser.error = null;
      state.suspendUser.message = null;
    },
    resetUnlockUser: (state) => {
      state.unlockUser.status = ReduxStateType.INIT;
      state.unlockUser.error = null;
      state.unlockUser.message = null;
    },
  },
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  createUserStart,
  createUserSuccess,
  createUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  suspendUserStart,
  suspendUserSuccess,
  suspendUserFailure,
  unlockUserStart,
  unlockUserSuccess,
  unlockUserFailure,
  setSelectedUser,
  clearError,
  resetState,
  resetCreateUser,
  resetUpdateUser,
  resetDeleteUser,
  resetSuspendUser,
  resetUnlockUser,
} = userSlice.actions;

export default userSlice.reducer;
