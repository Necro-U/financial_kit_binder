import { createSlice } from "@reduxjs/toolkit";
import { registerUser, loginUser, logoutUser } from "@/actions/authActions";
import { getUserData } from "@/actions/userActions";
import Cookies from "universal-cookie";
const initialState = {
  user: null,
  user_data: null,
  status: "idle",
  error: null,
  isAuthenticated: false,
};

let cookies = new Cookies(null, { path: "/" });

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.user = action.payload;
        state.isAuthenticated = true;
        cookies.set("token", state.user?.token);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.user = action.payload;
        state.isAuthenticated = true;
        cookies.set("token", state.user?.token);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
        state.user = null;
        state.user_data = null;
        state.isAuthenticated = false;
        cookies.remove("token");
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.user_data = action.payload;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("user") && action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("user") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.user_data = null;
          state.user = null;
          state.error = action.error.message;
        },
      );
  },
});

export default userSlice.reducer;
