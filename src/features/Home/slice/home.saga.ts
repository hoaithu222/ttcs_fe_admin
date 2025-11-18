import { call, put, takeEvery, all } from "redux-saga/effects";
import { homeApi } from "@/core/api/home";
import { addToast } from "@/app/store/slices/toast";
import type { fetchHomeDataStart } from "./home.slice";
import { fetchHomeDataSuccess, fetchHomeDataFailure } from "./home.slice";

type FetchHomeDataAction = ReturnType<typeof fetchHomeDataStart>;

// Helper function to extract error message from unknown error
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error && typeof error === "object") {
    const errorObj = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return errorObj?.response?.data?.message || errorObj?.message || defaultMessage;
  }
  return defaultMessage;
};

function* fetchHomeDataWorker(action: FetchHomeDataAction): Generator<unknown, void, any> {
  try {
    const { page = 1, limit = 10 } = action.payload || {};
    console.log("🚀 [Home Saga] Fetching home data with params:", { page, limit });

    // Fetch all home data in parallel using redux-saga all
    const [bannersResponse, categoriesResponse, bestSellerResponse, bestShopsResponse, flashSaleResponse] =
      yield all([
        call([homeApi, homeApi.getBanners]),
        call([homeApi, homeApi.getHomeCategories], { page, limit }),
        call([homeApi, homeApi.getBestSellerProducts], { page, limit }),
        call([homeApi, homeApi.getBestShops], { page, limit }),
        call([homeApi, homeApi.getFlashSaleProducts], { page, limit }),
      ]);

    console.log("📦 [Home Saga] API Responses:", {
      banners: bannersResponse,
      categories: categoriesResponse,
      bestSeller: bestSellerResponse,
      bestShops: bestShopsResponse,
      flashSale: flashSaleResponse,
    });

    // API returns ApiSuccess<T> where response.data is the ApiResponse object
    // Backend returns: { success, message, data: { categories: [...] }, meta }
    // So we need to access response.data.categories
    const homeData = {
      banners: bannersResponse.data?.banners || [],
      categories: categoriesResponse.data?.categories || [],
      bestSellerProducts: bestSellerResponse.data?.products || [],
      bestShops: bestShopsResponse.data?.shops || [],
      flashSaleProducts: flashSaleResponse.data?.products || [],
    };

    console.log("✅ [Home Saga] Processed home data:", homeData);
    yield put(fetchHomeDataSuccess(homeData));
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to fetch home data");
    yield put(fetchHomeDataFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

export function* homeSaga() {
  yield takeEvery("home/fetchHomeDataStart", fetchHomeDataWorker);
}

