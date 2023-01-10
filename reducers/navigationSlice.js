import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCategory: null,
  selectedProduct: null,
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload.category;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload.product;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSelectedCategory, setSelectedProduct } =
  navigationSlice.actions;

export const getSelectedCategory = (state) => state.navigation.selectedCategory;
export const getSelectedProduct = (state) => state.navigation.selectedProduct;

export default navigationSlice.reducer;
