import { all } from "redux-saga/effects";
import { authSaga } from "@/features/Auth/components/slice/auth.saga";
import { categorySaga } from "@/features/Category/slice/category.saga";
import { subCategorySaga } from "@/features/SubCategory/slice/subCategory.saga";
import { attributeTypeSaga } from "@/features/Attribute/slice/attributeType.saga";
import { attributeValueSaga } from "@/features/Attribute/slice/attributeValue.saga";
import { shopSaga } from "@/features/Shop/slice/Shop.saga";
import { userSaga } from "@/features/Users/slice/user.saga";

export const rootSage = function* () {
  try {
    yield all([
      authSaga(),
      categorySaga(),
      subCategorySaga(),
      attributeTypeSaga(),
      attributeValueSaga(),
      shopSaga(),
      userSaga(),
    ]);
  } catch (error) {
    console.error(error);
  }
};
