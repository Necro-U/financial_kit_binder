import { createSlice } from "@reduxjs/toolkit";
import { getNews } from "@/actions/newsActions";

const initialState = {
  status: "idle",
  news: [],
  error: null,
};

export const newsSlice = createSlice({
  name: "slice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNews.fulfilled, (state, actions) => {
        state.error = null;
        state.news = actions.payload;
        state.status = "succeeded";
      })
      .addCase(getNews.pending, (state) => {
        (state.status = "loading"), (state.error = null);
      })
      .addCase(getNews.rejected, (state) => {
        (state.status = "failed"), (state.error = "Failed to fetch news.");
      });
  },
});

export default newsSlice.reducer;
