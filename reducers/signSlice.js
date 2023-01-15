import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sign: {
    metadata: {
      product: "Engraved Sign",
      material: "Plastic",
      application: "None",
      colorCombination: "White/Black",
      price: null,
    },
    visual: {
      width: 250, //mm
      height: 100, //mm
      color: "#fff",
      textColor: "#000",
      shape: "Rounded Rectangle",
      elements: [],
    },
    data: {
      svg: "",
      pixelData: "",
    },
  },
};
function calculatePrice(sign) {
  let minimalPrice = 9.3;
  let area = sign.visual.width * sign.visual.height;
  if (!area > 0) return minimalPrice;
  //Area breakpoints in mm^2
  let ab_1 = 500;
  let ab_2 = 5000;
  let ab_3 = 10000;
  let ab_4 = 100000;

  //Price per mm^2 for each area bracke
  let f1 = 0.018;
  let f2 = 0.011;
  let f3 = 0.009;
  let f4 = 0.0082;

  if (sign.metadata.application === "Tape") {
    f1 = 0.02;
    f2 = 0.0125;
    f3 = 0.01;
    f4 = 0.009;
  }

  let price = 0;
  if (area <= ab_1) {
    price = area * f1;
  } else if (area <= ab_2) {
    price = ab_1 * f1 + (area - ab_1) * f2;
  } else if (area <= ab_3) {
    price = ab_1 * f1 + (ab_2 - ab_1) * f2 + (area - ab_2) * f3;
  } else if (area <= ab_4) {
    price =
      ab_1 * f1 +
      (ab_2 - ab_1) * f2 +
      (ab_3 - (ab_1 + ab_2)) * f3 +
      (area - ab_3) * f4;
  }
  return price <= minimalPrice ? minimalPrice : price;
}

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
      state.sign.metadata.price = calculatePrice(state.sign);
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
    setSignTextColor: (state, action) => {
      state.sign.visual.textColor = action.payload.textColor;
    },
    setSignColorCombination: (state, action) => {
      state.sign.metadata.colorCombination = action.payload.colorCombination;
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
  setSignTextColor,
  setSignColorCombination,
} = signSlice.actions;

export const getSignJSON = (state) => state.sign.sign;

export const getSignVisual = (state) => state.sign.sign.visual;

export const getSignMetadata = (state) => state.sign.sign.metadata;

export const getSignData = (state) => state.sign.sign.data;

export default signSlice.reducer;
