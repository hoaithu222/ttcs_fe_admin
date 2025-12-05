import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";

const shopState = (state: RootState) => state.shop;

export const selectShops = createSelector([shopState], (shop) => shop.shops);

export const selectSelectedShop = createSelector([shopState], (shop) => shop.selectedShop);

export const selectShopLoading = createSelector([shopState], (shop) => shop.isLoading);

export const selectShopError = createSelector([shopState], (shop) => shop.error);

export const selectShopPagination = createSelector([shopState], (shop) => shop.pagination);

export const selectShopFilters = createSelector([shopState], (shop) => shop.filters);

export const selectCreateShopStatus = createSelector([shopState], (shop) => shop.createShop.status);

export const selectUpdateShopStatus = createSelector([shopState], (shop) => shop.updateShop.status);

export const selectDeleteShopStatus = createSelector([shopState], (shop) => shop.deleteShop.status);

export const selectApproveShopStatus = createSelector(
  [shopState],
  (shop) => shop.approveShop.status
);

export const selectRejectShopStatus = createSelector([shopState], (shop) => shop.rejectShop.status);

export const selectSuspendShopStatus = createSelector(
  [shopState],
  (shop) => shop.suspendShop.status
);

export const selectUnlockShopStatus = createSelector(
  [shopState],
  (shop) => shop.unlockShop.status
);

export const selectCreateShopError = createSelector([shopState], (shop) => shop.createShop.error);

export const selectUpdateShopError = createSelector([shopState], (shop) => shop.updateShop.error);
