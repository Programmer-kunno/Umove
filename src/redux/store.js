import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { userOperations } from "./reducers/UserReducer";
import { loadingReducer } from "./reducers/LoaderReducer";
import { bookingDetails } from "./reducers/BookingReducer";
import { configureStore } from "@reduxjs/toolkit";

const config = {
  key: 'root',
  storage: AsyncStorage
}

const rootReducer = combineReducers({
  loadingReducer: loadingReducer,
  userOperations: persistReducer(config, userOperations),
  bookingDetails: persistReducer(config, bookingDetails)
})

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk]
})

const persistedStore = persistStore(store)

export {
  store,
  persistedStore
}