import { createSlice } from "@reduxjs/toolkit";

export const reduxSlice = createSlice({
  name: "globlestate",
  initialState: {
    showSideBar:false
  },
  reducers: {
    setSidebarshow: (state,action) => {
      state.showSideBar=action.payload
     }
  },
});

export const {
  setSidebarshow
} = reduxSlice.actions;
export default reduxSlice.reducer;