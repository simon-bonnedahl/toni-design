import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signBoard: {
    width: 600,
    height: 200,
    color: "#fff",
    border: "#000",
    material: "Aluminium",
    shape: "Rectangle",
    texts: [],
    images: [],
    saved: false,
    svg: "",
    pixelData: "",
  },
};

export const signBoardSlice = createSlice({
  name: "signBoard",
  initialState,
  reducers: {
    setSignboard: (state, action) => {
      state.signBoard = action.payload;
      state.signBoard.saved = false;
    },
    setSignboardColor: (state, action) => {
      state.signBoard.color = action.payload.color;
      state.signBoard.saved = false;
    },
    setSignboardWidth: (state, action) => {
      state.signBoard.width = action.payload.width;
      state.signBoard.saved = false;
    },
    setSignboardHeight: (state, action) => {
      state.signBoard.height = action.payload.height;
      state.signBoard.saved = false;
    },
    setSignboardMaterial: (state, action) => {
      state.signBoard.material = action.payload.material;
      state.signBoard.saved = false;
    },
    setSignboardShape: (state, action) => {
      state.signBoard.shape = action.payload.shape;
      state.signBoard.saved = false;
    },
    addSignboardText: (state, action) => {
      state.signBoard.texts.push(action.payload.text);
      state.signBoard.saved = false;
    },
    setTextRendered: (state, action) => {
      let text = state.signBoard.texts[action.payload.index];
      text.rendered = true;
    },
    addSignboardImage: (state, action) => {
      state.signBoard.images.push(action.payload.image);
      state.signBoard.saved = false;
    },
    setImageRendered: (state, action) => {
      let image = state.signBoard.images[action.payload.index];
      image.rendered = true;
    },
    setSignboardSvg: (state, action) => {
      state.signBoard.svg = action.payload.svg;
      state.signBoard.saved = true;
    },
    setSignboardPixelData: (state, action) => {
      state.signBoard.pixelData = action.payload.pixelData;
      state.signBoard.saved = true;
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
  addSignboardText,
  setTextRendered,
  addSignboardImage,
  setImageRendered,
  setSignboardShape,
  setSignboardSvg,
  setSignboardPixelData,
} = signBoardSlice.actions;

export const selectSignboard = (state) => state.signBoard.signBoard;

export default signBoardSlice.reducer;
