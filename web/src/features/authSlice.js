import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: null, // Роль пользователя, по умолчанию отсутствует
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserRole: (state, action) => {
      state.role = action.payload;
    },
    clearUserRole: (state) => {
      state.role = null;
    },
  },
});

export const { setUserRole, clearUserRole } = authSlice.actions;
export default authSlice.reducer;
