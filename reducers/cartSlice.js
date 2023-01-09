import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  customer: "private",
};

export const cartSlice = createSlice({
  name: "cart",
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
    clearCart: (state) => {
      state.items = [];
    },

    setCustomer: (state, action) => {
      state.customer = action.payload.customer;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, removeFromCart, setCustomer, clearCart } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartItemsWithId = (state, id) =>
  state.cart.items.filter((item) => item.id === id);

export const selectCustomer = (state) => state.cart.customer;

export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => (total += item.price), 0);

export default cartSlice.reducer;
