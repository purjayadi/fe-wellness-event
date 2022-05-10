import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IPanelSlice {
  selectedKeys: string[];
  openKeys: string[];
}

const initialState: IPanelSlice = {
  selectedKeys: ["dashboard"],
  openKeys: [],
};

export const panelSlice = createSlice({
  name: "panel",
  initialState,
  reducers: {
    setSelectedKeys: (state, action: PayloadAction<string[]>) => {
      state.selectedKeys = action.payload;
    },
    setOpenKeys: (state, action: PayloadAction<string[]>) => {
      state.openKeys = action.payload;
    },
  },
});

export const { setSelectedKeys, setOpenKeys } = panelSlice.actions;

export default panelSlice.reducer;
