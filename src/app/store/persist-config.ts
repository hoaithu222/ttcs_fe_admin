//lưu dữ liệu ở local storage
import { PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rootReducer } from "./root-reducer";

export const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: "root",
  storage,
  // Bao gồm auth slice để persist authentication state
  whitelist: ["auth"],
};
