import { createAsyncThunk } from "@reduxjs/toolkit";
import httpFetch from "@/utils/httpFetch";

export const getIndices_ = createAsyncThunk("user/getIndices", async () => {
  const response = await httpFetch({
    url: "/user/watchlist",
    method: "GET",
  });

  return response.data;
});

export const getIndices = createAsyncThunk("indices/getIndices", async () => {
  const response = await httpFetch({
    url: "/indices",
    method: "GET",
  });

  return response.data;
});
