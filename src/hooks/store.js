import { combineReducers, configureStore } from "@reduxjs/toolkit";
import tokenSlice from "./tokenSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { thunk } from "redux-thunk";
import userSlice from "./userSlice";
import alarmSlice from "./alarmSlice"

const reducers = combineReducers({
  token: tokenSlice,
  user: userSlice,
  alarm: alarmSlice
});


const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(thunk),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
