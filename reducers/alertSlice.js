import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  success: "",
  error: "",
  info: "",
  warning: "",
  loading: "",
};

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    setInfo: (state, action) => {
      state.info = action.payload;
    },
    setWarning: (state, action) => {
      state.warning = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearAlerts: (state) => {
      state.success = "";
      state.error = "";
      state.info = "";
      state.warning = "";
      state.loading = "";
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSuccess,
  setInfo,
  setWarning,
  setError,
  setLoading,
  clearAlerts,
} = alertSlice.actions;

export const selectAlerts = (state) => state.alert;

export default alertSlice.reducer;
