import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signBoard: {
    width: 600,
    height: 200,
    color: "#fff",
    border: "#000",
    material: "aluminium",
    pixelData: null,
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
    setSignboardPixelData: (state, action) => {
      state.signBoard.pixelData = action.payload.pixelData;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSignboard, setSignboardColor, setSignboardPixelData } =
  signBoardSlice.actions;

export const selectSignboard = (state) => state.signBoard.signBoard;

export default signBoardSlice.reducer;
