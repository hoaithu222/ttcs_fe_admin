import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";

const homeState = (state: RootState) => state.home;

export const selectBanners = createSelector([homeState], (home) => home.banners);

export const selectHomeCategories = createSelector([homeState], (home) => home.categories);

export const selectBestSellerProducts = createSelector(
  [homeState],
  (home) => home.bestSellerProducts
);

export const selectBestShops = createSelector([homeState], (home) => home.bestShops);

export const selectFlashSaleProducts = createSelector(
  [homeState],
  (home) => home.flashSaleProducts
);

export const selectHomeLoading = createSelector([homeState], (home) => home.isLoading);

export const selectHomeError = createSelector([homeState], (home) => home.error);

export const selectFetchHomeDataStatus = createSelector(
  [homeState],
  (home) => home.fetchHomeData.status
);

