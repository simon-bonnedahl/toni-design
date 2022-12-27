import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signBoard: {
    width: null,
    height: null,
    background: null,
    border: null,
    material: null,
  },
};

export const signBoard = createSlice({
  name: "signBoard",
  initialState,
  reducers: {
    setSignboard: (state, action) => {
      state.signBoard = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSignboard } = signBoardSlice.actions;

export const selectSignboard = (state) => state.signBoard.signBoard;

export default signBoardSlice.reducer;
