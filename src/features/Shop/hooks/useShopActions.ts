import { useCallback, useEffect } from "react";
import { useAppDispatch } from "@/app/store";
import {
  fetchShopsStart,
  deleteShopStart,
  approveShopStart,
  rejectShopStart,
  suspendShopStart,
  setSelectedShop,
} from "../slice/Shop.slice";
import { Shop } from "@/core/api/shops/type";
import {
  selectCreateShopStatus,
  selectUpdateShopStatus,
  selectDeleteShopStatus,
  selectApproveShopStatus,
  selectRejectShopStatus,
  selectSuspendShopStatus,
} from "../slice/Shop.selector";
import { useSelector } from "react-redux";
import { ReduxStateType } from "@/app/store/types";

export const useShopActions = () => {
  const dispatch = useAppDispatch();
  const createShopStatus = useSelector(selectCreateShopStatus);
  const updateShopStatus = useSelector(selectUpdateShopStatus);
  const deleteShopStatus = useSelector(selectDeleteShopStatus);
  const approveShopStatus = useSelector(selectApproveShopStatus);
  const rejectShopStatus = useSelector(selectRejectShopStatus);
  const suspendShopStatus = useSelector(selectSuspendShopStatus);

  const fetchShops = useCallback(
    (payload: {
      page?: number;
      limit?: number;
      search?: string;
      status?: "pending" | "active" | "blocked";
      isActive?: boolean;
      isVerified?: boolean;
    }) => {
      dispatch(fetchShopsStart(payload));
    },
    [dispatch]
  );

  // lắng nghe khi thành công thêm/sửa/xóa/duyệt/từ chối/khóa shop thì sẽ fetch lại danh sách
  useEffect(() => {
    if (
      createShopStatus === ReduxStateType.SUCCESS ||
      updateShopStatus === ReduxStateType.SUCCESS ||
      deleteShopStatus === ReduxStateType.SUCCESS ||
      approveShopStatus === ReduxStateType.SUCCESS ||
      rejectShopStatus === ReduxStateType.SUCCESS ||
      suspendShopStatus === ReduxStateType.SUCCESS
    ) {
      dispatch(fetchShopsStart({ page: 1, limit: 10 }));
    }
  }, [
    createShopStatus,
    updateShopStatus,
    deleteShopStatus,
    approveShopStatus,
    rejectShopStatus,
    suspendShopStatus,
    dispatch,
  ]);

  const deleteShop = useCallback(
    (id: string) => {
      dispatch(deleteShopStart(id));
    },
    [dispatch]
  );

  const approveShop = useCallback(
    (id: string) => {
      dispatch(approveShopStart(id));
    },
    [dispatch]
  );

  const rejectShop = useCallback(
    (id: string) => {
      dispatch(rejectShopStart(id));
    },
    [dispatch]
  );

  const suspendShop = useCallback(
    (id: string) => {
      dispatch(suspendShopStart(id));
    },
    [dispatch]
  );

  const selectShop = useCallback(
    (shop: Shop | null) => {
      dispatch(setSelectedShop(shop));
    },
    [dispatch]
  );

  return {
    fetchShops,
    deleteShop,
    approveShop,
    rejectShop,
    suspendShop,
    selectShop,
  };
};

