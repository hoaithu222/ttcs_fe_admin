import { all } from "redux-saga/effects";
import { authSaga } from "@/features/Auth/components/slice/auth.saga";
import { categorySaga } from "@/features/Category/slice/category.saga";
import { subCategorySaga } from "@/features/SubCategory/slice/subCategory.saga";
import { attributeTypeSaga } from "@/features/Attribute/slice/attributeType.saga";
import { attributeValueSaga } from "@/features/Attribute/slice/attributeValue.saga";

export const rootSage = function* () {
  try {
    yield all([authSaga(), categorySaga(), subCategorySaga(), attributeTypeSaga(), attributeValueSaga()]);
  } catch (error) {
    console.error(error);
  }
};
