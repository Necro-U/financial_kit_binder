import { createSlice } from "@reduxjs/toolkit";
import { getIndices } from "@/actions/indiceActions";

const initialState = {
  status: "idle",
  indices: [],
  error: null,
};

export const indiceSlice = createSlice({
  name: "indice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIndices.fulfilled, (state, action) => {
        state.status = "succeed";
        state.indices = action.payload.map((t, i) => ({ ...t, id: i + 1 }));
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("indice") && action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("indice") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        },
      );
  },
});

export default indiceSlice.reducer;
