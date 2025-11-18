import { useCallback } from "react";
import { useAppDispatch } from "@/app/store";
import { fetchDashboardDataStart } from "../slice/dashboard.slice";

export const useDashboardActions = () => {
  const dispatch = useAppDispatch();

  const fetchDashboardData = useCallback(() => {
    dispatch(fetchDashboardDataStart());
  }, [dispatch]);

  return {
    fetchDashboardData,
  };
};

