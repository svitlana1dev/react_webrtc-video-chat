import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "../MapPage/mapSlice";

export const store = configureStore({
  reducer: {
    map: mapReducer,
  },
});
