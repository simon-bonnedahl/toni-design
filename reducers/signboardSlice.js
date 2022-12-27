import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signBoard: {
    width: 600,
    height: 200,
    background: "#fff",
    border: "#000",
    material: "aluminium",
  },
};

export const signBoardSlice = createSlice({
  name: "signBoard",
  initialState,
  reducers: {
    setSignboard: (state, action) => {
      state.signBoard = action.payload;
    },
    setSignboardColor: (state, action) => {
      state.signBoard.background = action.payload.color;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSignboard, setSignboardColor } = signBoardSlice.actions;

export const selectSignboard = (state) => state.signBoard.signBoard;

export default signBoardSlice.reducer;
