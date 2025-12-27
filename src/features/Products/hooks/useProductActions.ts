import { useCallback, useEffect } from "react";
import { useAppDispatch } from "@/app/store";
import {
  fetchProductsStart,
  deleteProductStart,
  setSelectedProduct,
  updateProductStatusStart,
} from "../slice/product.slice";
import { Product } from "@/core/api/products/type";
import {
  selectCreateProductStatus,
  selectUpdateProductStatus,
  selectUpdateProductStatusStatus,
  selectDeleteProductStatus,
} from "../slice/product.selector";
import { useSelector } from "react-redux";
import { ReduxStateType } from "@/app/store/types";

export const useProductActions = () => {
  const dispatch = useAppDispatch();
  const createProductStatus = useSelector(selectCreateProductStatus);
  const updateProductStatus = useSelector(selectUpdateProductStatus);
  const updateProductStatusState = useSelector(selectUpdateProductStatusStatus);
  const deleteProductStatus = useSelector(selectDeleteProductStatus);

  const fetchProducts = useCallback(
    (payload: { page?: number; limit?: number; search?: string; status?: "approved" | "hidden" | "violated" }) => {
      dispatch(fetchProductsStart(payload));
    },
    [dispatch]
  );

  // Refetch when status changes
  useEffect(() => {
    if (
      createProductStatus === ReduxStateType.SUCCESS ||
      updateProductStatus === ReduxStateType.SUCCESS ||
      updateProductStatusState === ReduxStateType.SUCCESS ||
      deleteProductStatus === ReduxStateType.SUCCESS
    ) {
      dispatch(fetchProductsStart({ page: 1, limit: 20 }));
    }
  }, [
    createProductStatus,
    updateProductStatus,
    updateProductStatusState,
    deleteProductStatus,
    dispatch,
  ]);

  const deleteProduct = useCallback(
    (id: string) => {
      dispatch(deleteProductStart(id));
    },
    [dispatch]
  );

  const selectProduct = useCallback(
    (product: Product | null) => {
      dispatch(setSelectedProduct(product));
    },
    [dispatch]
  );

  const updateProductStatusAction = useCallback(
    (id: string, status: "approved" | "hidden" | "violated", violationNote?: string) => {
      dispatch(updateProductStatusStart({ id, status, violationNote }));
    },
    [dispatch]
  );

  return {
    fetchProducts,
    deleteProduct,
    selectProduct,
    updateProductStatus: updateProductStatusAction,
  };
};
