import { useCallback } from "react";
import { useAppDispatch } from "@/app/store";
import { fetchHomeDataStart } from "../slice/home.slice";

export const useHomeActions = () => {
  const dispatch = useAppDispatch();

  const fetchHomeData = useCallback(
    (payload?: { page?: number; limit?: number }) => {
      dispatch(fetchHomeDataStart(payload || {}));
    },
    [dispatch]
  );

  return {
    fetchHomeData,
  };
};

