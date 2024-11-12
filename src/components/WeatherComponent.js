import React, { useState } from "react";
import {
  getWeatherStatusCode,
  getWeatherIconFromBackend,
} from "../services/WeatherService";

const WeatherComponent = () => {
  const [weatherIcon, setWeatherIcon] = useState("");
  const [latitude, setLatitude] = useState(37.5666791); // 서울 위도
  const [longitude, setLongitude] = useState(126.9782914); // 서울 경도
  const [loading, setLoading] = useState(false);

  // 날씨 아이콘을 가져오는 함수
  const fetchWeatherIcon = async () => {
    setLoading(true);
    try {
      // 날씨 상태 코드 받아오기
      const weatherStatusCode = await getWeatherStatusCode(latitude, longitude);
      // 백엔드에서 날씨 아이콘 받아오기
      const icon = await getWeatherIconFromBackend(weatherStatusCode);
      setWeatherIcon(icon); // 아이콘 상태 업데이트
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 날씨 아이콘을 가져오기
  React.useEffect(() => {
    fetchWeatherIcon();
  }, []);

  return (
    <div>
      <h1>Weather Information</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {/* 날씨 이모티콘만 출력 */}
          <h2>{weatherIcon}</h2>
        </div>
      )}
      <button onClick={fetchWeatherIcon}>Get Weather Icon</button>
    </div>
  );
};

export default WeatherComponent;
