import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  showModal: false,
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
    setShowModal: (state, action) => {
      state.showModal = action.payload.showModal;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addToCart,
  removeFromCart,
  setCustomer,
  setShowModal,
  clearCart,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartItemsWithId = (state, id) =>
  state.cart.items.filter((item) => item.id === id);

export const selectCustomer = (state) => state.cart.customer;

export const isCartModalOpen = (state) => state.cart.showModal;

export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => (total += item.price), 0);

export default cartSlice.reducer;
