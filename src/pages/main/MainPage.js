import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import MainWeatherIcon from "../../components/MainWeatherIcons";
import Book from "./book";
import NotificationIcon from "../../components/NotificationIcon";
import HomeIcon from "../../components/HomeIcon";
import NotificationModal from "../../components/NotificationModal";
import useChatAlerts from "../../hooks/useChatAlerts";
import UserList from "./UserList";
import DiaryList from "./DiaryList";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";

import SideBarLeft from "../../components/SideBarLeft";
import SideBarRight from "../../components/SideBarRight";

import "../../css/MainPage.css";
import "../../css/Media.css";
import HanmberNavbar from "./HamberNavbar";

function MainPage() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userInfo = useSelector(getUserInfo);

  // 채팅 알림 훅
  const { chatAlerts, isModalOpen, openModal, closeModal } = useChatAlerts();

  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = "e2799674d5b13024688e4a3159a6829d";
      const lat = 37.5665; // 서울의 위도
      const lon = 126.978; // 서울의 경도
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=kr&units=metric`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("날씨 정보를 가져오는 데 실패했습니다.");
        }
        const data = await response.json();

        console.log("API 응답 데이터:", data); // 응답 데이터 확인

        // 하루에 하나의 날씨만 추출
        const dailyWeather = [];
        for (let i = 0; i < 5; i++) {
          if (data.list[i * 8]) {
            // 데이터가 있을 경우만 추출
            dailyWeather.push(data.list[i * 8]);
          }
        }

        // 날씨 데이터를 상태에 저장
        setWeatherData(dailyWeather);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  // 현재 경로가 active 상태인지 확인
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <div className="UserProfile">
      <header className="header">
        <HanmberNavbar />
        <img src="/img/logo.png" alt="logo" className="logo" />
        <h2>Main</h2>
        <div className="header-icons">
          <NotificationIcon onClick={openModal} />
          <HomeIcon />
        </div>
        <NotificationModal
          isOpen={isModalOpen} // 모달 상태 전달
          closeModal={closeModal} // 모달 닫기 함수 전달
          chatAlerts={chatAlerts} // 알림 데이터 전달
        />
      </header>
      <div className="container">
        <aside className="sidebar-left">
          <SideBarLeft />
        </aside>
        <main className="main-content">
          <aside className="weather-widget">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : weatherData && weatherData.length > 0 ? (
              <div className="weather-container">
                {weatherData.map((forecast, index) => (
                  <div key={index} className="weather-card">
                    <p className="weather-date">
                      {new Date(forecast.dt * 1000).toLocaleDateString(
                        "ko-KR",
                        { month: "2-digit", day: "2-digit" }
                      )}
                    </p>
                    <MainWeatherIcon id={forecast.weather[0]?.id} />
                    <p className="weather-temp">
                      {forecast.main.temp.toFixed(1)}°C
                    </p>
                    <p className="weather-description">
                      {forecast.weather[0]?.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>날씨 데이터가 존재하지 않습니다.</p>
            )}
          </aside>

          <aside className="main-down">
            <div className="main-book">
              <Book />
            </div>
            <div className="main-diary">
              <DiaryList />
            </div>
            <div className="user-list">
              <UserList />
            </div>
          </aside>
        </main>
        <aside className="sidebar-right">
          <SideBarRight />
          <div className="profile">{/* details */}</div>
        </aside>
      </div>
    </div>
  );
}

export default MainPage;
