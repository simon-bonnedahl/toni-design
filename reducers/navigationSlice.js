import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  current: null,
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCurrent: (state, action) => {
      state.current = action.payload.current;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrent } = navigationSlice.actions;

export const selectCurrent = (state) => state.navigation.current;

export default navigationSlice.reducer;
