import { configureStore } from "@reduxjs/toolkit";
import signBoardReducer from "./reducers/signBoardSlice";
import toolbarReducer from "./reducers/toolbarSlice";
export const store = configureStore({
  reducer: {
    signBoard: signBoardReducer,
    toolbar: toolbarReducer,
  },
});
