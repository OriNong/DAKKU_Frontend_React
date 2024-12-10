import { createSlice } from "@reduxjs/toolkit";

const alarmSlice = createSlice({
  name: "alarm",
  initialState: {
    info: [],
  },

  reducers: {
    setAlarmInfo: (state, action) => {
      state.info = action.payload;
    },
    removeAlarmInfo: (state) => {
      state.info = [];
    },
  },
});
export default alarmSlice.reducer;
export const { setAlarmInfo, removeAlarmInfo } = alarmSlice.actions;
export const getAlarmInfo = (state) => state.alarm.info;
