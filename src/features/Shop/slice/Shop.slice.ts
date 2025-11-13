import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ShopState } from "./Shop.type";
import { Shop } from "@/core/api/shops/type";
import { ReduxStateType } from "@/app/store/types";

const initialState: ShopState = {
  shops: [],
  selectedShop: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  createShop: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  updateShop: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  deleteShop: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  approveShop: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  rejectShop: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  suspendShop: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  filters: {
    search: "",
    status: undefined,
    isActive: undefined,
    isVerified: undefined,
  },
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    // Saga triggers
    fetchShopsStart: (
      state,
      action: PayloadAction<{
        page?: number;
        limit?: number;
        search?: string;
        status?: "pending" | "active" | "blocked";
        isActive?: boolean;
        isVerified?: boolean;
      }>
    ) => {
      state.isLoading = true;
      state.error = null;
      if (action.payload.page) state.pagination.page = action.payload.page;
      if (action.payload.search !== undefined) state.filters.search = action.payload.search;
      if (action.payload.status !== undefined) state.filters.status = action.payload.status;
      if (action.payload.isActive !== undefined) state.filters.isActive = action.payload.isActive;
      if (action.payload.isVerified !== undefined)
        state.filters.isVerified = action.payload.isVerified;
    },
    fetchShopsSuccess: (state, action: PayloadAction<{ shops: Shop[]; pagination: any }>) => {
      state.isLoading = false;
      state.error = null;
      state.shops = action.payload.shops;
      state.pagination = action.payload.pagination;
    },
    fetchShopsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.shops = [];
    },

    createShopStart: (state, _action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
      state.createShop.status = ReduxStateType.LOADING;
      state.createShop.error = null;
      state.createShop.message = null;
    },
    createShopSuccess: (state, action: PayloadAction<Shop>) => {
      state.isLoading = false;
      state.shops = [action.payload, ...state.shops];
      state.createShop.status = ReduxStateType.SUCCESS;
      state.createShop.error = null;
      state.createShop.message = null;
    },
    createShopFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.createShop.status = ReduxStateType.ERROR;
      state.createShop.error = action.payload;
      state.createShop.message = action.payload;
    },

    updateShopStart: (state, _action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
      state.updateShop.status = ReduxStateType.LOADING;
      state.updateShop.error = null;
      state.updateShop.message = null;
    },
    updateShopSuccess: (state, action: PayloadAction<Shop>) => {
      state.isLoading = false;
      state.updateShop.status = ReduxStateType.SUCCESS;
      state.updateShop.error = null;
      state.updateShop.message = null;
      const index = state.shops.findIndex((shop) => shop._id === action.payload._id);
      if (index !== -1) {
        state.shops[index] = action.payload;
      }
    },
    updateShopFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.updateShop.status = ReduxStateType.ERROR;
      state.updateShop.error = action.payload;
      state.updateShop.message = action.payload;
    },

    deleteShopStart: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
      state.deleteShop.status = ReduxStateType.LOADING;
      state.deleteShop.error = null;
      state.deleteShop.message = null;
    },
    deleteShopSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.deleteShop.status = ReduxStateType.SUCCESS;
      state.deleteShop.error = null;
      state.deleteShop.message = null;
      state.shops = state.shops.filter((shop) => shop._id !== action.payload);
    },
    deleteShopFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.deleteShop.status = ReduxStateType.ERROR;
      state.deleteShop.error = action.payload;
      state.deleteShop.message = action.payload;
    },

    approveShopStart: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
      state.approveShop.status = ReduxStateType.LOADING;
      state.approveShop.error = null;
      state.approveShop.message = null;
    },
    approveShopSuccess: (state, action: PayloadAction<Shop>) => {
      state.isLoading = false;
      state.approveShop.status = ReduxStateType.SUCCESS;
      state.approveShop.error = null;
      state.approveShop.message = null;
      const index = state.shops.findIndex((shop) => shop._id === action.payload._id);
      if (index !== -1) {
        state.shops[index] = action.payload;
      }
    },
    approveShopFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.approveShop.status = ReduxStateType.ERROR;
      state.approveShop.error = action.payload;
      state.approveShop.message = action.payload;
    },

    rejectShopStart: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
      state.rejectShop.status = ReduxStateType.LOADING;
      state.rejectShop.error = null;
      state.rejectShop.message = null;
    },
    rejectShopSuccess: (state, action: PayloadAction<Shop>) => {
      state.isLoading = false;
      state.rejectShop.status = ReduxStateType.SUCCESS;
      state.rejectShop.error = null;
      state.rejectShop.message = null;
      const index = state.shops.findIndex((shop) => shop._id === action.payload._id);
      if (index !== -1) {
        state.shops[index] = action.payload;
      }
    },
    rejectShopFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.rejectShop.status = ReduxStateType.ERROR;
      state.rejectShop.error = action.payload;
      state.rejectShop.message = action.payload;
    },

    suspendShopStart: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
      state.suspendShop.status = ReduxStateType.LOADING;
      state.suspendShop.error = null;
      state.suspendShop.message = null;
    },
    suspendShopSuccess: (state, action: PayloadAction<Shop>) => {
      state.isLoading = false;
      state.suspendShop.status = ReduxStateType.SUCCESS;
      state.suspendShop.error = null;
      state.suspendShop.message = null;
      const index = state.shops.findIndex((shop) => shop._id === action.payload._id);
      if (index !== -1) {
        state.shops[index] = action.payload;
      }
    },
    suspendShopFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.suspendShop.status = ReduxStateType.ERROR;
      state.suspendShop.error = action.payload;
      state.suspendShop.message = action.payload;
    },

    setSelectedShop: (state, action: PayloadAction<Shop | null>) => {
      state.selectedShop = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
    // reset state
    resetState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.createShop.status = ReduxStateType.INIT;
      state.createShop.error = null;
      state.createShop.message = null;
      state.updateShop.status = ReduxStateType.INIT;
      state.updateShop.error = null;
      state.updateShop.message = null;
      state.deleteShop.status = ReduxStateType.INIT;
      state.deleteShop.error = null;
      state.deleteShop.message = null;
      state.approveShop.status = ReduxStateType.INIT;
      state.approveShop.error = null;
      state.approveShop.message = null;
      state.rejectShop.status = ReduxStateType.INIT;
      state.rejectShop.error = null;
      state.rejectShop.message = null;
      state.suspendShop.status = ReduxStateType.INIT;
      state.suspendShop.error = null;
      state.suspendShop.message = null;
    },
    resetCreateShop: (state) => {
      state.createShop.status = ReduxStateType.INIT;
      state.createShop.error = null;
      state.createShop.message = null;
    },
    resetUpdateShop: (state) => {
      state.updateShop.status = ReduxStateType.INIT;
      state.updateShop.error = null;
      state.updateShop.message = null;
    },
    resetDeleteShop: (state) => {
      state.deleteShop.status = ReduxStateType.INIT;
      state.deleteShop.error = null;
      state.deleteShop.message = null;
    },
    resetApproveShop: (state) => {
      state.approveShop.status = ReduxStateType.INIT;
      state.approveShop.error = null;
      state.approveShop.message = null;
    },
    resetRejectShop: (state) => {
      state.rejectShop.status = ReduxStateType.INIT;
      state.rejectShop.error = null;
      state.rejectShop.message = null;
    },
    resetSuspendShop: (state) => {
      state.suspendShop.status = ReduxStateType.INIT;
      state.suspendShop.error = null;
      state.suspendShop.message = null;
    },
  },
});

export const {
  fetchShopsStart,
  fetchShopsSuccess,
  fetchShopsFailure,
  createShopStart,
  createShopSuccess,
  createShopFailure,
  updateShopStart,
  updateShopSuccess,
  updateShopFailure,
  deleteShopStart,
  deleteShopSuccess,
  deleteShopFailure,
  approveShopStart,
  approveShopSuccess,
  approveShopFailure,
  rejectShopStart,
  rejectShopSuccess,
  rejectShopFailure,
  suspendShopStart,
  suspendShopSuccess,
  suspendShopFailure,
  setSelectedShop,
  clearError,
  resetState,
  resetCreateShop,
  resetUpdateShop,
  resetDeleteShop,
  resetApproveShop,
  resetRejectShop,
  resetSuspendShop,
} = shopSlice.actions;

export default shopSlice.reducer;
