import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

export const shoppingcartSlice = createSlice({
  name: "shoppingcart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    removeFromCart: (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      let newCart = [...state.items];

      if (index >= 0) {
        newCart.splice(index, 1);
      }
      state.items = newCart;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, removeFromCart } = shoppingcartSlice.actions;

export const selectCartItems = (state) => state.shoppingcart.items;

export const selectCartItemsWithId = (state, id) =>
  state.shoppingcart.items.filter((item) => item.id === id);

export const selectCartTotal = (state) =>
  state.shoppingcart.items.reduce((total, item) => (total += item.price), 0);

export default shoppingcartSlice.reducer;
