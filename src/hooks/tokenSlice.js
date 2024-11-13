import { createSlice } from "@reduxjs/toolkit";
import { removeStorageToken, setStorageToken } from "../helper/storage";

const tokenSlice = createSlice({
  name: "token",
  initialState: {
    info: {
      accessToken: "",
      refreshToken: "",
      tokenType: "",
      expiryDuration: 0,
    },
  },

  // 로그인할 때 토큰값 집어 넣는 메서드
  reducers: {
    setTokenInfo: (state, action) => {
      state.info = action.payload;
      setStorageToken(action.payload);
    },
    // 로그아웃 할 때 토큰값을 지우기
    removeTokenInfo: (state) => {
      state.info = {
        accessToken: "",
        refreshToken: "",
        tokenType: "",
        expiryDuration: 0,
      };
      removeStorageToken();
    },
  },
});
export default tokenSlice.reducer;
// {토큰 정보 저장하고 삭제하는 메서드}
export const { setTokenInfo, removeTokenInfo } = tokenSlice.actions;
// 저장한 토큰정보를 가져오는 메서드
export const getTokenInfo = (state) => state.token.info;
