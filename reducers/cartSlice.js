import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  customer: "private",
  modify: false,
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
    toggleModify: (state) => {
      state.modify = !state.modify;
    },
    setCustomer: (state, action) => {
      state.customer = action.payload.customer;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addToCart,
  removeFromCart,
  setCustomer,
  clearCart,
  toggleModify,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartItemsWithId = (state, id) =>
  state.cart.items.filter((item) => item.id === id);

export const selectCustomer = (state) => state.cart.customer;

export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => (total += item.price), 0);

export const getModify = (state) => state.cart.modify;

export default cartSlice.reducer;
