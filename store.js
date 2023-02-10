import { configureStore } from "@reduxjs/toolkit";
import signReducer from "./reducers/signSlice";
import cartReducer from "./reducers/cartSlice";
import navigationReducer from "./reducers/navigationSlice";

export const store = configureStore({
  reducer: {
    sign: signReducer,
    cart: cartReducer,
    navigation: navigationReducer,
  },
});
