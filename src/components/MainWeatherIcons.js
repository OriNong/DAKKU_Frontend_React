import React from "react";

// 날씨 상태 코드에 맞는 이미지 파일 경로를 관리
const weatherImages = {
  200: "/img/11d.png", // Thunderstorm with light rain
  201: "/img/11d.png", // Thunderstorm with rain
  202: "/img/11d.png", // Thunderstorm with heavy rain
  210: "/img/11d.png", // Light thunderstorm
  211: "/img/11d.png", // Thunderstorm
  212: "/img/11d.png", // Heavy thunderstorm
  221: "/img/11d.png", // Ragged thunderstorm
  230: "/img/11d.png", // Thunderstorm with light drizzle
  231: "/img/11d.png", // Thunderstorm with drizzle
  232: "/img/11d.png", // Thunderstorm with heavy drizzle
  300: "/img/09d.png", // Light intensity drizzle
  301: "/img/09d.png", // Drizzle
  302: "/img/09d.png", // Heavy intensity drizzle
  310: "/img/09d.png", // Light intensity drizzle rain
  311: "/img/09d.png", // Drizzle rain
  312: "/img/09d.png", // Heavy intensity drizzle rain
  500: "/img/10d.png", // Light rain
  501: "/img/10d.png", // Moderate rain
  502: "/img/10d.png", // Heavy intensity rain
  503: "/img/10d.png", // Very heavy rain
  504: "/img/10d.png", // Extreme rain
  511: "/img/13d.png", // Freezing rain
  520: "/img/09d.png", // Light intensity shower rain
  521: "/img/09d.png", // Shower rain
  522: "/img/09d.png", // Heavy intensity shower rain
  531: "/img/09d.png", // Ragged shower rain
  600: "/img/13d.png", // Light snow
  601: "/img/13d.png", // Snow
  602: "/img/13d.png", // Heavy snow
  611: "/img/13d.png", // Sleet
  612: "/img/13d.png", // Light shower sleet
  613: "/img/13d.png", // Shower sleet
  615: "/img/13d.png", // Light rain and snow
  616: "/img/13d.png", // Rain and snow
  620: "/img/13d.png", // Light shower snow
  621: "/img/13d.png", // Shower snow
  622: "/img/13d.png", // Heavy shower snow
  701: "/img/50d.png", // Mist
  711: "/img/50d.png", // Smoke
  721: "/img/50d.png", // Haze
  731: "/img/50d.png", // Dust
  741: "/img/50d.png", // Fog
  751: "/img/50d.png", // Sand
  761: "/img/50d.png", // Dust
  762: "/img/50d.png", // Volcanic ash
  771: "/img/50d.png", // Squalls
  781: "/img/50d.png", // Tornado
  800: "/img/01d.png", // Clear sky
  801: "/img/02d.png", // Few clouds
  802: "/img/03d.png", // Scattered clouds
  803: "/img/04d.png", // Broken clouds
  804: "/img/04d.png", // Overcast clouds
};

const MainWeatherIcon = ({ id }) => {
  // 날씨 상태 코드에 맞는 이미지 경로 반환
  const imageSrc = weatherImages[id] || "/img/01d.png"; // 기본값: clear sky 이미지

  return <img src={imageSrc} alt="Weather icon" className="weather-icon" />;
};

export default MainWeatherIcon;
