import { createAsyncThunk } from "@reduxjs/toolkit";
import httpFetch from "@/utils/httpFetch";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (body) => {
    const response = await httpFetch({
      method: "POST",
      url: "/users/register/",
      data: body,
    });
    return response.data;
  },
);

export const loginUser = createAsyncThunk("auth/loginUser", async (body) => {
  const response = await httpFetch({
    method: "POST",
    url: "/users/login/",
    data: body,
  });
  return response.data;
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {});
