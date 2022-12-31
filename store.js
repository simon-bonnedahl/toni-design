import { configureStore } from "@reduxjs/toolkit";
import signReducer from "./reducers/signSlice";
import toolbarReducer from "./reducers/toolbarSlice";
import shoppingcartReducer from "./reducers/shoppingcartSlice";
import editorReducer from "./reducers/editorSlice";

export const store = configureStore({
  reducer: {
    sign: signReducer,
    toolbar: toolbarReducer,
    shoppingcart: shoppingcartReducer,
    editor: editorReducer,
  },
});
