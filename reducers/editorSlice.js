import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  commands: [],
};

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    addCommand: (state, action) => {
      state.commands = [...state.commands, action.payload];
    },
  },
});

// Action creators are generated for each case reducer function
export const { addCommand } = editorSlice.actions;

export const selectCommands = (state) => state.editor.commands;

export default editorSlice.reducer;
