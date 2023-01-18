import { configureStore } from "@reduxjs/toolkit";
import signReducer from "./reducers/signSlice";
import cartReducer from "./reducers/cartSlice";
import editorReducer from "./reducers/editorSlice";
import navigationReducer from "./reducers/navigationSlice";

export const store = configureStore({
  reducer: {
    sign: signReducer,
    cart: cartReducer,
    editor: editorReducer,
    navigation: navigationReducer,
  },
});
