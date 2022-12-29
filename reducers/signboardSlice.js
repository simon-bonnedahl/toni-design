import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signBoard: {
    product: "Skylt",
    width: 250, //mm
    height: 100, //mm
    color: "#fff",
    application: "Skruv",
    border: "#000",
    material: "Aluminium",
    shape: "Rectangle",
    price: 1000,
    texts: [],
    images: [],
    zoom: 1,
    svg: "",
    pixelData: "",
  },
};
const calculatePrice = (state) => {
  let width = state.signBoard.width;
  let height = state.signBoard.height;
  let c = 0.125;
  return width * height * c;
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
      state.signBoard.price = calculatePrice(state);
    },
    setSignboardHeight: (state, action) => {
      state.signBoard.height = action.payload.height;
      state.signBoard.price = calculatePrice(state);
    },
    setSignboardMaterial: (state, action) => {
      state.signBoard.material = action.payload.material;
    },
    setSignboardApplication: (state, action) => {
      state.signBoard.application = action.payload.application;
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
    signboardZoom: (state, action) => {
      let zoomStep = 1.25;
      if (action.payload.zoom === "in") {
        state.signBoard.zoom *= zoomStep;
      } else if (action.payload.zoom === "out") {
        state.signBoard.zoom /= zoomStep;
      }
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
  setSignboardApplication,
  addSignboardText,
  setTextRendered,
  addSignboardImage,
  setImageRendered,
  setSignboardShape,
  setSignboardSvg,
  setSignboardPixelData,
  signboardZoom,
} = signBoardSlice.actions;

export const selectSignboard = (state) => state.signBoard.signBoard;

export default signBoardSlice.reducer;
