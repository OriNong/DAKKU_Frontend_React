import React, { useState } from "react";
import {
  getWeatherStatusCode,
  getWeatherIconFromBackend,
} from "../services/WeatherService";
import axios from "axios";

const DiaryComponent = () => {
  const [latitude, setLatitude] = useState(37.5666791);
  const [longitude, setLongitude] = useState(126.9782914);
  const [diaryContent, setDiaryContent] = useState("");
  const [title, setTitle] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");

  const saveDiary = async () => {
    try {
      // 날씨 상태 코드 받아오기
      const weatherStatusCode = await getWeatherStatusCode(latitude, longitude);

      // 백엔드에서 날씨 아이콘 받기
      const icon = await getWeatherIconFromBackend(weatherStatusCode);
      setWeatherIcon(icon); // 날씨 아이콘 상태 업데이트

      const diaryData = {
        title,
        content: diaryContent,
      };

      // 일기 데이터와 날씨 아이콘을 서버에 전송
      await axios.post(`${process.env.REACT_APP_HOST}/diary/save`, diaryData, {
        params: { weatherIcon: icon }, // 날씨 아이콘 전달
      });

      alert("일기가 저장되었습니다!");
    } catch (error) {
      console.error("일기 저장 중 오류 발생:", error);
      alert("일기 저장에 실패했습니다.");
    }
  };

  return (
    <div>
      <h1>일기</h1>
      <input
        type="text"
        placeholder="일기 제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <textarea
        value={diaryContent}
        onChange={(e) => setDiaryContent(e.target.value)}
        placeholder="오늘의 일기를 작성하세요"
        rows="6"
        cols="40"
      ></textarea>
      <br />
      <button onClick={saveDiary}>저장</button>
    </div>
  );
};

export default DiaryComponent;
