import { createSlice } from "@reduxjs/toolkit";

export const reduxSlice = createSlice({
  name: "globlestate",
  initialState: {
    showSideBar: false,
    isDataSorting: false
  },
  reducers: {
    setSidebarshow: (state, action) => {
      state.showSideBar = action.payload
    },
    setDatasorting: (state, action) => {
      state.isDataSorting = action.payload
    }
  },
});

export const {
  setSidebarshow,
  setDatasorting
} = reduxSlice.actions;
export default reduxSlice.reducer;