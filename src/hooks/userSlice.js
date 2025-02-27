import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    info: {
      active: false,
      email: "",
      roles: [],
      username: "",
      id: 0,
    },
  },

  reducers: {
    setUserInfo: (state, action) => {
      state.info = action.payload;
    },
    removeUserInfo: (state) => {
      state.info = {
        active: false,
        email: "",
        roles: [],
        username: "",
        id: 0,
      };
    },
  },
});
export default userSlice.reducer;
export const { setUserInfo, removeUserInfo } = userSlice.actions;
export const getUserInfo = (state) => state.user.info;
