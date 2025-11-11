import { useCallback, useEffect } from "react";
import { useAppDispatch } from "@/app/store";
import {
  fetchSubCategoriesStart,
  deleteSubCategoryStart,
  setSelectedSubCategory,
} from "../slice/subCategory.slice";
import { useSelector } from "react-redux";
import { selectSubCategoryPagination } from "../slice/subCategory.selector";

export const useSubCategoryActions = () => {
  const dispatch = useAppDispatch();
  const pagination = useSelector(selectSubCategoryPagination) || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  const fetchSubCategories = useCallback(
    (payload: {
      page?: number;
      limit?: number;
      search?: string;
      isActive?: boolean;
      parentId?: string;
    }) => {
      dispatch(fetchSubCategoriesStart(payload));
    },
    [dispatch]
  );

  useEffect(() => {
    // Future: listen to create/update/delete statuses to refresh list if needed
  }, [dispatch]);

  const deleteSubCategory = useCallback(
    (id: string) => {
      dispatch(deleteSubCategoryStart(id));
      // refetch current page after deletion
      dispatch(
        fetchSubCategoriesStart({
          page: pagination.page,
          limit: pagination.limit,
        })
      );
    },
    [dispatch, pagination.page, pagination.limit]
  );

  const selectSubCategory = useCallback(
    (subCategory: any | null) => {
      dispatch(setSelectedSubCategory(subCategory));
    },
    [dispatch]
  );

  return {
    fetchSubCategories,
    deleteSubCategory,
    selectSubCategory,
  };
};
