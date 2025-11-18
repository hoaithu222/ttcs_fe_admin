import { ReduxStateType } from "@/app/store/types";
import { UserStatistics, ProductStatistics } from "@/core/api/admin/type";

export interface DashboardState {
  userStatistics: UserStatistics | null;
  productStatistics: ProductStatistics | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
}

