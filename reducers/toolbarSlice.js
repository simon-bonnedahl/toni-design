import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  toolbar: {
    selectedOption: null,
  },
};

export const toolbarSlice = createSlice({
  name: "toolbar",
  initialState,
  reducers: {
    setSelectedOption: (state, action) => {
      state.toolbar.selectedOption = action.payload.selectedOption;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSelectedOption } = toolbarSlice.actions;

export const selectToolbar = (state) => state.toolbar.toolbar;

export default toolbarSlice.reducer;
