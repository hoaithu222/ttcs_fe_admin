import { ReduxStateType } from "@/app/store/types";
import { HomeCategory, HomeProduct, HomeShop, Banner } from "@/core/api/home/type";

export interface HomeState {
  banners: Banner[];
  categories: HomeCategory[];
  bestSellerProducts: HomeProduct[];
  bestShops: HomeShop[];
  flashSaleProducts: HomeProduct[];
  isLoading: boolean;
  error: string | null;
  fetchHomeData: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
}

export interface FetchHomeDataPayload {
  page?: number;
  limit?: number;
}

