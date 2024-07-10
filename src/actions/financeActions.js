import { createAsyncThunk } from "@reduxjs/toolkit";
import httpFetch from "@/utils/httpFetch";

export const getBalancesheet = createAsyncThunk(
  "finance/getBalancesheet",
  async (body) => {
    const response = await httpFetch({
      method: "POST",
      url: "/balancesheet/",
      data: body,
    });
    return response.data;
  },
);

export const getCashflow = createAsyncThunk(
  "finance/getCashflow",
  async (body) => {
    const response = await httpFetch({
      method: "POST",
      url: "/cashflow/",
      data: body,
    });
    return response.data;
  },
);

export const getHistories = createAsyncThunk(
  "finance/getHistories",
  async (body) => {
    const response = await httpFetch({
      method: "POST",
      url: "/histories/",
      data: body,
    });
    return response.data;
  },
);

export const getIncomeStatement = createAsyncThunk(
  "finance/getIncomeStatement",
  async (body) => {
    const response = await httpFetch({
      method: "POST",
      url: "/incomestatement/",
      data: body,
    });
    return response.data;
  },
);

export const getIndicators = createAsyncThunk(
  "finance/getIndicators",
  async (body) => {
    const response = await httpFetch({
      method: "GET",
      url: "/indicators/",
      data: body,
    });
    return response.data;
  },
);

export const getStockTechnicals = createAsyncThunk(
  "finance/getStockTechnicals",
  async (symbol, body) => {
    const response = await httpFetch({
      method: "POST",
      url: `/stocks/${symbol}/technicals`,
      data: body,
    });
    return response.data;
  },
);
