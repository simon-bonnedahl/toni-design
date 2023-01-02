import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  showModal: false,
  buyer: "private",
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
    setBuyer: (state, action) => {
      state.buyer = action.payload.buyer;
    },
    setShowModal: (state, action) => {
      state.showModal = action.payload.showModal;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, removeFromCart, setBuyer, setShowModal } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartItemsWithId = (state, id) =>
  state.cart.items.filter((item) => item.id === id);

export const selectBuyer = (state) => state.cart.buyer;

export const isCartModalOpen = (state) => state.cart.showModal;

export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => (total += item.price), 0);

export default cartSlice.reducer;
