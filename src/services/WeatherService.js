import axios from "axios";

// 날씨 API 키
const WEATHER_API_KEY = "e2799674d5b13024688e4a3159a6829d";
const WEATHER_API_URL =
  "http://api.openweathermap.org/data/2.5/weather?lat=37.5666791&lon=126.9782914&appid=e2799674d5b13024688e4a3159a6829d";

// 날씨 API 호출하여 날씨 상태 코드 받아오기
export const getWeatherStatusCode = async (latitude, longitude) => {
  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: WEATHER_API_KEY,
      },
    });
    // 날씨 상태 코드(weatherId) 반환
    return response.data.weather[0].id;
  } catch (error) {
    console.error("Error fetching weather status:", error);
    throw error;
  }
};

// 날씨 상태 코드로 이모티콘을 받기 위해 백엔드 API 호출
export const getWeatherIconFromBackend = async (weatherId) => {
  try {
    // 날씨 상태 코드로 백엔드에서 이모티콘을 가져옵니다.
    const response = await axios.get(
      `${process.env.REACT_APP_HOST}/weather/weatherIcon`,
      {
        params: { weatherId },
      }
    );
    // DB에서 가져온 날씨 이모티콘을 반환
    return response.data;
  } catch (error) {
    console.error("Error fetching weather icon:", error);
    throw error;
  }
};
