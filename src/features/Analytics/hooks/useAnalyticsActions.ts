import { useCallback } from "react";
import { useAppDispatch } from "@/app/store";
import { fetchAnalyticsDataStart, setFilters } from "../slice/analytics.slice";
import { AnalyticsQuery } from "@/core/api/analytics/type";

export const useAnalyticsActions = () => {
  const dispatch = useAppDispatch();

  const fetchAnalyticsData = useCallback(
    (query?: AnalyticsQuery) => {
      dispatch(fetchAnalyticsDataStart(query));
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (filters: AnalyticsQuery) => {
      dispatch(setFilters(filters));
    },
    [dispatch]
  );

  return {
    fetchAnalyticsData,
    updateFilters,
  };
};

