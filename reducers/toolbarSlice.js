import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  toolbar: {
    selectedOption: null,
    zoom: 1,
    downloadSVG: false,
    downloadPDF: false,
  },
};

export const toolbarSlice = createSlice({
  name: "toolbar",
  initialState,
  reducers: {
    setSelectedOption: (state, action) => {
      state.toolbar.selectedOption = action.payload.selectedOption;
    },
    signboardZoom: (state, action) => {
      let zoomStep = 0.25;
      if (action.payload.zoom === "in") {
        state.signBoard.zoom += zoomStep;
      } else if (action.payload.zoom === "out") {
        state.signBoard.zoom -= zoomStep;
      }
    },
    setDownloadSvg: (state, action) => {
      state.signBoard.downloadSvg = action.payload.downloadSvg;
      state.signBoard.zoom = 1;
    },
    setDownloadPdf: (state, action) => {
      state.signBoard.downloadPdf = action.payload.downloadPdf;
      state.signBoard.zoom = 1;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSelectedOption,
  signboardZoom,
  setDownloadSvg,
  setDownloadPdf,
} = toolbarSlice.actions;

export const selectToolbar = (state) => state.toolbar.toolbar;

export default toolbarSlice.reducer;
