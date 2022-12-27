import { configureStore } from "@reduxjs/toolkit";
import signBoardReducer from "./reducers/signBoardSlice";

export const store = configureStore({
  reducer: {
    signBoard: signBoardReducer,
  },
});
