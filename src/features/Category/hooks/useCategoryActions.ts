import { useCallback, useEffect } from "react";
import { useAppDispatch } from "@/app/store";
import {
  fetchCategoriesStart,
  deleteCategoryStart,
  setSelectedCategory,
} from "../slice/category.slice";
import { Category } from "@/core/api/categories/type";
import {
  selectCreateCategoryStatus,
  selectUpdateCategoryStatus,
  selectDeleteCategoryStatus,
} from "../slice/category.selector";
import { useSelector } from "react-redux";
import { ReduxStateType } from "@/app/store/types";

export const useCategoryActions = () => {
  const dispatch = useAppDispatch();
  const createCategoryStatus = useSelector(selectCreateCategoryStatus);
  const updateCategoryStatus = useSelector(selectUpdateCategoryStatus);
  const deleteCategoryStatus = useSelector(selectDeleteCategoryStatus);

  const fetchCategories = useCallback(
    (payload: { page?: number; limit?: number; search?: string; isActive?: boolean }) => {
      dispatch(fetchCategoriesStart(payload));
    },
    [dispatch]
  );
  // lắng nghe khi thành công thêm danh mục thì sẽ fetch lại danh sách danh mục
  useEffect(() => {
    if (
      createCategoryStatus === ReduxStateType.SUCCESS ||
      updateCategoryStatus === ReduxStateType.SUCCESS ||
      deleteCategoryStatus === ReduxStateType.SUCCESS
    ) {
      dispatch(fetchCategoriesStart({ page: 1, limit: 10 }));
    }
  }, [createCategoryStatus, updateCategoryStatus, deleteCategoryStatus, dispatch]);

  const deleteCategory = useCallback(
    (id: string) => {
      dispatch(deleteCategoryStart(id));
    },
    [dispatch]
  );

  const selectCategory = useCallback(
    (category: Category | null) => {
      dispatch(setSelectedCategory(category));
    },
    [dispatch]
  );

  return {
    fetchCategories,
    deleteCategory,
    selectCategory,
  };
};
