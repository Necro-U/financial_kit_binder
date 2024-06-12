import { configureStore } from "@reduxjs/toolkit";
import financeSlice from "@/reducers/financeSlice";
import userSlice from "@/reducers/userSlice";
import portfolioSlice from "@/reducers/portfoliosSlice";
import stocksSlice from "@/reducers/stocksSlice";
import indicesSlice from "@/reducers/indicesSlice";
import newsSlice from "@/reducers/newsSlice";

export default configureStore({
  reducer: {
    finance: financeSlice,
    user: userSlice,
    portfolio: portfolioSlice,
    stocks: stocksSlice,
    indices: indicesSlice,
    news: newsSlice,
  },
});
