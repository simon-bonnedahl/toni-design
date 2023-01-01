import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sign: {
    metadata: {
      product: "Engraved Sign",
      material: "Plastic",
      application: "None",
      price: null,
    },
    visual: {
      width: 250, //mm
      height: 100, //mm
      color: "#fff",
      shape: "Rectangle",
      elements: [],
    },
    data: {
      svg: "",
      pixelData: "",
    },
  },
};

const calculatePrice = (sign) => {
  let width = sign.visual.width;
  let height = sign.visual.height;
  let c = 0.00725;
  return width * height * c;
};
//Calculate price at initialization
initialState.sign.metadata.price = calculatePrice(initialState.sign);

export const signSlice = createSlice({
  name: "sign",
  initialState,
  reducers: {
    setSign: (state, action) => {
      state.sign = action.payload.sign;
    },
    setSignProduct: (state, action) => {
      state.sign.metadata.product = action.payload.product;
    },
    setSignMaterial: (state, action) => {
      state.sign.metadata.material = action.payload.material;
    },
    setSignApplication: (state, action) => {
      state.sign.metadata.application = action.payload.application;
    },
    setSignSvg: (state, action) => {
      state.sign.data.svg = action.payload.svg;
    },
    setSignPixelData: (state, action) => {
      state.sign.data.pixelData = action.payload.pixelData;
    },
    saveSign: (state, action) => {
      state.sign.visual = action.payload.sign;
      state.sign.metadata.price = calculatePrice(state.sign);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSign,
  setSignProduct,
  setSignMaterial,
  setSignApplication,
  setSignSvg,
  setSignPixelData,
  saveSign,
} = signSlice.actions;

export const getSignJSON = (state) => state.sign.sign;

export const getSignVisual = (state) => state.sign.sign.visual;

export const getSignMetadata = (state) => state.sign.sign.metadata;

export const getSignData = (state) => state.sign.sign.data;

export default signSlice.reducer;
