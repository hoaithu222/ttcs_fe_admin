import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  AttributeType,
  CreateAttributeTypeRequest,
  UpdateAttributeTypeRequest,
} from "@/core/api/attribute-type/type";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  fetchAttributeTypesStart,
  createAttributeTypeStart,
  updateAttributeTypeStart,
  deleteAttributeTypeStart,
} from "../slice/attributeType.slice";

export interface UseAttributeTypeTableOptions {
  initialPage?: number;
  initialLimit?: number;
}

export function useAttributeTypeTable(options?: UseAttributeTypeTableOptions) {
  const dispatch = useAppDispatch();
  const slice = useAppSelector((s) => s.attributeType);
  const data: AttributeType[] = useMemo(
    () => slice.ids.map((id) => slice.entities[id]).filter(Boolean) as AttributeType[],
    [slice.ids, slice.entities]
  );
  const [page, setPage] = useState<number>(options?.initialPage ?? slice.pagination.page ?? 1);
  const [limit, setLimit] = useState<number>(options?.initialLimit ?? slice.pagination.limit ?? 10);
  const [search, setSearch] = useState<string>(slice.filters.search ?? "");
  const [isActive, setIsActive] = useState<string | undefined>(
    slice.filters.isActive === undefined
      ? undefined
      : slice.filters.isActive
        ? "active"
        : "inactive"
  );

  const fetchList = useCallback(() => {
    dispatch(
      fetchAttributeTypesStart({
        page,
        limit,
        search,
        isActive: isActive === undefined ? undefined : isActive === "active",
      })
    );
  }, [dispatch, page, limit, search, isActive]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const onPageChange = useCallback((nextPage: number) => setPage(nextPage), []);

  const createType = useCallback(
    async (payload: CreateAttributeTypeRequest) => {
      dispatch(createAttributeTypeStart({ data: payload }));
    },
    [dispatch]
  );

  const updateType = useCallback(
    async (id: string, payload: UpdateAttributeTypeRequest) => {
      dispatch(updateAttributeTypeStart({ id, data: payload }));
    },
    [dispatch]
  );

  const deleteType = useCallback(
    async (id: string) => {
      dispatch(deleteAttributeTypeStart(id));
    },
    [dispatch]
  );

  return {
    // data
    data,
    isLoading: slice.isLoading,
    error: slice.error,
    page,
    limit,
    total: slice.pagination.total,
    totalPages: slice.pagination.totalPages,
    // filters
    search,
    isActive,
    // handlers
    setSearch,
    setIsActive,
    setLimit,
    onPageChange,
    refetch: fetchList,
    // CRUD
    createType,
    updateType,
    deleteType,
  };
}

export default useAttributeTypeTable;
