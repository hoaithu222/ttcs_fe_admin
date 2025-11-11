import { combineReducers } from "@reduxjs/toolkit";
import languageReducer from "./slices/language";
import themeReducer from "./slices/theme";
import authReducer from "@/features/Auth/components/slice/auth.slice";
import { toastReducer } from "./slices/toast";
import categoryReducer from "@/features/Category/slice/category.slice";
import subCategoryReducer from "@/features/SubCategory/slice/subCategory.slice";
import attributeTypeReducer from "@/features/Attribute/slice/attributeType.slice";
import attributeValueReducer from "@/features/Attribute/slice/attributeValue.slice";
import { AppReducerType } from "./types";

export const rootReducer = combineReducers({
  [AppReducerType.LANGUAGE]: languageReducer,
  [AppReducerType.THEME]: themeReducer,
  [AppReducerType.AUTH]: authReducer,
  [AppReducerType.TOAST]: toastReducer,
  [AppReducerType.CATEGORY]: categoryReducer,
  subCategory: subCategoryReducer,
  attributeType: attributeTypeReducer,
  attributeValue: attributeValueReducer,
});
