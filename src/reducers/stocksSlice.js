import { createSlice } from "@reduxjs/toolkit";
import {
  getTrendings,
  getTopGainers,
  getStocks,
  getOverview,
  getTechnical,
  getFinancials,
  getNews,
  getCharts,
  getStockPeerAnalysis,
  getStockHistory,
  getInfo,
} from "@/actions/stockActions";

const initialState = {
  status: "idle",
  trendings: [],
  topGainers: [],
  stocks: [],
  overview: [],
  technical: [],
  financials: [],
  news: [],
  charts: [],
  stockPeerAnalysis: [],
  stockHistory: [],
  info: [],
  error: null,
};

export const stocksSlice = createSlice({
  name: "indice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTrendings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.trendings = action.payload.map((t, i) => ({ ...t, id: i + 1 }));
      })
      .addCase(getTopGainers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.topGainers = action.payload;
      })
      .addCase(getStocks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stocks = action.payload.map((s, i) => ({ ...s, id: i + 1 }));
      })
      .addCase(getOverview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.overview = action.payload;
      })
      .addCase(getTechnical.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.technical = action.payload;
      })
      .addCase(getFinancials.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.financials = action.payload;
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.news = action.payload;
      })
      .addCase(getCharts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.charts = action.payload;
      })
      .addCase(getStockPeerAnalysis.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stockPeerAnalysis = action.payload;
      })
      .addCase(getStockHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stockHistory = action.payload;
      })
      .addCase(getInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.info = action.payload;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("stock") && action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("stock") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        },
      );
  },
});

export default stocksSlice.reducer;
