import { all } from "redux-saga/effects";
import { authSaga } from "@/features/Auth/components/slice/auth.saga";
import { categorySaga } from "@/features/Category/slice/category.saga";

export const rootSage = function* () {
  try {
    yield all([authSaga(), categorySaga()]);
  } catch (error) {
    console.error(error);
  }
};
