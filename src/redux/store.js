import { configureStore } from '@reduxjs/toolkit'
import { articleApi, commentApi, userApi } from "./services/";
import { userReducer } from "./features/";

export const makeStore = () => {
  return configureStore({
    reducer: {
        userStore: userReducer,
    [   articleApi.reducerPath]: articleApi.reducer,
    [   commentApi.reducerPath]: commentApi.reducer,
    [   userApi.reducerPath]: userApi.reducer,
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({}).concat([
        articleApi.middleware, 
        commentApi.middleware,
        userApi.middleware,
      ]),
  })
}