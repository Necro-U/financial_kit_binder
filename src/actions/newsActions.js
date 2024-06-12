import { createAsyncThunk } from "@reduxjs/toolkit";
import httpFetch from "@/utils/httpFetch";

export const getNews = createAsyncThunk("news/getNews", async () => {
  const response = await httpFetch({
    url: "/news",
    method: "GET",
  });
  return response.data;
});
