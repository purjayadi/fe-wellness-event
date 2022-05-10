import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { signIn, signOut } from "next-auth/react";
import { customMessage, openNotificationWithIcon } from "../../config/message";

export interface ILoginSlice {
  isLoading: boolean;
  isLoadingLogout: boolean;
  isConfirm: boolean
}

interface ILogin {
  username: string;
  password: string;
}
// loginAction
export const loginAction = createAsyncThunk(
  "auth/login",
  async (payload: ILogin, { getState, requestId }) => {
    const response = await signIn("credentials", {
      redirect: false,
      username: payload.username,
      password: payload.password,
    });
    return response;
  }
);

export const logOutAction = createAsyncThunk(
  "auth/logout",
  async ({}, { getState, requestId }) => {
    await signOut({ redirect: false });
  }
);

const initialState: ILoginSlice = {
  isLoading: false,
  isLoadingLogout: false,
  isConfirm: false,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder loginAction
    builder.addCase(loginAction.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log(action);
      // @ts-ignore
      if (action.payload?.status === 401) {
        openNotificationWithIcon({ type: "error", message: "Invalid username or password" });
      } else {
        openNotificationWithIcon({ type: "success", message: "Login success" });
      }
    });
    builder.addCase(loginAction.rejected, (state, action) => {
      state.isLoading = false;
      openNotificationWithIcon({ type: "error", message: "Login failed" });
    });
    // end builder loginAction

    // builder logOutAction
    builder.addCase(logOutAction.pending, (state, action) => {
      state.isLoadingLogout = true;
    });
    builder.addCase(logOutAction.fulfilled, (state, action) => {
      state.isConfirm = false;
      state.isLoadingLogout = false;
    });
    builder.addCase(logOutAction.rejected, (state, action) => {
      state.isLoadingLogout = false;
    });
    // end builder logOutAction
  },
});

export default loginSlice.reducer;
