import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signBoard: {
    product: "Skylt",
    width: 250, //mm
    height: 100, //mm
    color: "#fff",
    border: "#000",
    material: "Aluminium",
    shape: "Rectangle",
    texts: [],
    images: [],
    svg: "",
    pixelData: "",
  },
};

export const signBoardSlice = createSlice({
  name: "signBoard",
  initialState,
  reducers: {
    setSignboardProduct: (state, action) => {
      state.signBoard.product = action.payload.product;
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
    addSignboardText: (state, action) => {
      state.signBoard.texts.push(action.payload.text);
    },
    setTextRendered: (state, action) => {
      let text = state.signBoard.texts[action.payload.index];
      text.rendered = true;
    },
    addSignboardImage: (state, action) => {
      state.signBoard.images.push(action.payload.image);
    },
    setImageRendered: (state, action) => {
      let image = state.signBoard.images[action.payload.index];
      image.rendered = true;
    },
    setSignboardSvg: (state, action) => {
      state.signBoard.svg = action.payload.svg;
    },
    setSignboardPixelData: (state, action) => {
      state.signBoard.pixelData = action.payload.pixelData;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSignboardProduct,
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
