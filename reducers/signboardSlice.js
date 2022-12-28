import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signBoard: {
    width: 600,
    height: 200,
    color: "#fff",
    border: "#000",
    material: "Aluminium",
    shape: "Rectangle",
    text: {
      string: "Hello World!",
      font: "Helvetica",
      fontSize: 40,
      color: "#000",
    },
    svg: "",
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
    setSignboardMaterial: (state, action) => {
      state.signBoard.material = action.payload.material;
    },
    setSignboardShape: (state, action) => {
      state.signBoard.shape = action.payload.shape;
    },
    setSignboardText: (state, action) => {
      state.signBoard.text = action.payload.text;
    },
    setSignboardSvg: (state, action) => {
      state.signBoard.svg = action.payload.svg;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSignboard,
  setSignboardColor,
  setSignboardWidth,
  setSignboardHeight,
  setSignboardMaterial,
  setSignboardText,
  setSignboardSvg,
  setSignboardShape,
} = signBoardSlice.actions;

export const selectSignboard = (state) => state.signBoard.signBoard;

export default signBoardSlice.reducer;
