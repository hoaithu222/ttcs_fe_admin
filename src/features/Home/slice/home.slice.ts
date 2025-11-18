import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HomeState } from "./home.type";
import { Banner, HomeCategory, HomeProduct, HomeShop } from "@/core/api/home/type";
import { ReduxStateType } from "@/app/store/types";

const initialState: HomeState = {
  banners: [],
  categories: [],
  bestSellerProducts: [],
  bestShops: [],
  flashSaleProducts: [],
  isLoading: false,
  error: null,
  fetchHomeData: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    // Saga triggers
    fetchHomeDataStart: (state, _action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
      state.fetchHomeData.status = ReduxStateType.LOADING;
      state.fetchHomeData.error = null;
      state.fetchHomeData.message = null;
    },
    fetchHomeDataSuccess: (
      state,
      action: PayloadAction<{
        banners?: Banner[];
        categories?: HomeCategory[];
        bestSellerProducts?: HomeProduct[];
        bestShops?: HomeShop[];
        flashSaleProducts?: HomeProduct[];
      }>
    ) => {
      state.isLoading = false;
      state.error = null;
      state.fetchHomeData.status = ReduxStateType.SUCCESS;
      state.fetchHomeData.error = null;
      state.fetchHomeData.message = null;

      if (action.payload.banners) {
        state.banners = action.payload.banners;
      }
      if (action.payload.categories) {
        state.categories = action.payload.categories;
      }
      if (action.payload.bestSellerProducts) {
        state.bestSellerProducts = action.payload.bestSellerProducts;
      }
      if (action.payload.bestShops) {
        state.bestShops = action.payload.bestShops;
      }
      if (action.payload.flashSaleProducts) {
        state.flashSaleProducts = action.payload.flashSaleProducts;
      }
    },
    fetchHomeDataFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.fetchHomeData.status = ReduxStateType.ERROR;
      state.fetchHomeData.error = action.payload;
      state.fetchHomeData.message = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.fetchHomeData.status = ReduxStateType.INIT;
      state.fetchHomeData.error = null;
      state.fetchHomeData.message = null;
    },
  },
});

export const {
  fetchHomeDataStart,
  fetchHomeDataSuccess,
  fetchHomeDataFailure,
  clearError,
  resetState,
} = homeSlice.actions;

export default homeSlice.reducer;

