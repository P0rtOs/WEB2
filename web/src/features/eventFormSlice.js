import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  description: "",
  date: "",
};

const eventFormSlice = createSlice({
  name: "eventForm",
  initialState,
  reducers: {
    setField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetForm: (state) => {
      state.title = "";
      state.description = "";
      state.date = "";
    },
  },
});

export const { setField, resetForm } = eventFormSlice.actions;
export default eventFormSlice.reducer;
