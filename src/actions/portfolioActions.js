import { createAsyncThunk } from "@reduxjs/toolkit";
import httpFetch from "@/utils/httpFetch";

export const getAllPortfolios = createAsyncThunk(
  "portfolios/getAllPortfolios",
  async () => {
    const response = await httpFetch({
      url: "/portfolios",
      method: "GET",
    });
    return response.data;
  },
);

export const getPortfolio = createAsyncThunk(
  "portfolios/getPortfolio",
  async (id) => {
    const response = await httpFetch({
      url: `/portfolios/${id}/detail`,
      method: "GET",
    });
    return { portfolioId: id, data: response.data.portfolio_items };
  },
);

export const createPortfolio = createAsyncThunk(
  "portfolios/createPortfolio",
  async (body) => {
    const response = await httpFetch({
      url: "/portfolios/create",
      method: "POST",
      data: body,
    });

    return response.data;
  },
);

export const deletePortfolio = createAsyncThunk(
  "portfolios/deletePortfolio",
  async (id) => {
    await httpFetch({
      url: `/portfolios/${id}/delete`,
      method: "DELETE",
    });

    return id;
  },
);

export const createPortfolioItem = createAsyncThunk(
  "portfolios/createItem",
  async (body) => {
    const response = await httpFetch({
      url: "/portfolios/items/create",
      method: "POST",
      data: body,
    });
    return { portfolioId: body.portfolio_id, data: response.data };
  },
);

export const getPortfolioItemTransaction = createAsyncThunk(
  "portfolios/getItemTransaction",
  async (id) => {
    const response = await httpFetch({
      url: `/portfolios/items/${id}/transactions`,
      method: "GET",
    });

    return { itemId: id, data: response.data };
  },
);

export const deletePortfolioItem = createAsyncThunk(
  "portfolios/deletePortfolioItem",
  async (id) => {
    const response = await httpFetch({
      url: `/portfolios/items/${id}/delete`,
      method: "DELETE",
    });
    return { portfolioId: response.data.portfolio, data: response.data };
  },
);

export const putTransaction = createAsyncThunk(
  "user/portfolios/putTransaction",
  async ({ id, body }) => {
    const response = await httpFetch({
      url: `/portfolios/items/transactions/${id}/update`,
      method: "PUT",
      data: body,
    });
    return { itemId: response.data.portfolio_item, data: response.data };
  },
);

export const patchTransaction = createAsyncThunk(
  "portfolios/patchTransaction",
  async (id, body) => {
    const response = await httpFetch({
      url: `/portfolios/items/transactions/${id}/update`,
      method: "PATCH",
      data: body,
    });
    return { itemId: response.data.portfolio_item, data: response.data };
  },
);

export const createTransaction = createAsyncThunk(
  "portfolios/createTransaction",
  async (body) => {
    const response = await httpFetch({
      url: `/portfolios/items/transactions/create`,
      method: "POST",
      data: body,
    });
    return { itemId: response.data.portfolio_item, data: response.data };
  },
);

export const deleteTransaction = createAsyncThunk(
  "portfolios/deleteTransaction",
  async (itemId, transactionId) => {
    await httpFetch({
      url: `/portfolios/items/transactions/${transactionId}/delete`,
      method: "DELETE",
    });
    return { itemId, transactionId };
  },
);
