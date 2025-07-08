import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  blogs: [],         // ✅ Must be an array
  loading: false,    // ✅ Optional but useful
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlog: (state, action) => {
      state.blogs = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setBlog, setLoading } = blogSlice.actions;
export default blogSlice.reducer;
