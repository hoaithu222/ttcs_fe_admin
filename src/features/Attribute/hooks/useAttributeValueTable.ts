import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  AttributeValue,
  CreateAttributeValueRequest,
  UpdateAttributeValueRequest,
} from "@/core/api/attribute-value/type";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  fetchAttributeValuesStart,
  createAttributeValueStart,
  updateAttributeValueStart,
  deleteAttributeValueStart,
} from "../slice/attributeValue.slice";

export interface UseAttributeValueTableOptions {
  attributeTypeId?: string;
  initialPage?: number;
  initialLimit?: number;
}

export function useAttributeValueTable(options?: UseAttributeValueTableOptions) {
  const dispatch = useAppDispatch();
  const slice = useAppSelector((s) => s.attributeValue);
  const data: AttributeValue[] = useMemo(
    () => slice.ids.map((id) => slice.entities[id]).filter(Boolean) as AttributeValue[],
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
  const attributeTypeId = options?.attributeTypeId;

  const fetchList = useCallback(() => {
    if (!attributeTypeId) return;
    dispatch(
      fetchAttributeValuesStart({
        page,
        limit,
        search,
        isActive: isActive === undefined ? undefined : isActive === "active",
        attributeTypeId,
      })
    );
  }, [dispatch, page, limit, search, isActive, attributeTypeId]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const onPageChange = useCallback((nextPage: number) => setPage(nextPage), []);

  const createValue = useCallback(
    async (payload: CreateAttributeValueRequest) => {
      dispatch(createAttributeValueStart({ data: payload }));
    },
    [dispatch]
  );

  const updateValue = useCallback(
    async (id: string, payload: UpdateAttributeValueRequest) => {
      dispatch(updateAttributeValueStart({ id, data: payload }));
    },
    [dispatch]
  );

  const deleteValue = useCallback(
    async (id: string) => {
      dispatch(deleteAttributeValueStart(id));
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
    attributeTypeId,
    // handlers
    setSearch,
    setIsActive,
    setLimit,
    onPageChange,
    refetch: fetchList,
    // CRUD
    createValue,
    updateValue,
    deleteValue,
  };
}

export default useAttributeValueTable;
