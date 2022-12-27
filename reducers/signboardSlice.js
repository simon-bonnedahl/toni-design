import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signBoard: {
    width: 600,
    height: 200,
    color: "#fff",
    border: "#000",
    material: "aluminium",
    shape: "rectangle",
    text: {
      string: "Hello World!",
      font: "Helvetica",
      fontSize: 40,
      color: "#000",
    },
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
      state.signBoard.color = action.payload.color;
    },
    setSignboardWidth: (state, action) => {
      state.signBoard.width = action.payload.width;
    },
    setSignboardHeight: (state, action) => {
      state.signBoard.height = action.payload.height;
    },
    setSignboardText: (state, action) => {
      state.signBoard.text = action.payload.text;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSignboard,
  setSignboardColor,
  setSignboardWidth,
  setSignboardHeight,
  setSignboardText,
} = signBoardSlice.actions;

export const selectSignboard = (state) => state.signBoard.signBoard;

export default signBoardSlice.reducer;
