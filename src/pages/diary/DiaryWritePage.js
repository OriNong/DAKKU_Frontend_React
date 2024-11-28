import React, { useEffect, useState } from "react";
import {
  getWeatherStatusCode,
  getWeatherIconFromBackend,
} from "../../services/WeatherService";
import instance from "../../instance/instance";
import TextEditor from "../../components/TextEditorComponent";
import { Switch } from "@mui/material";
import "../../css/DiaryWritePage.css";
import Swal from "sweetalert2";

const DiaryComponent = () => {
  const [latitude, setLatitude] = useState(37.5666791);
  const [longitude, setLongitude] = useState(126.9782914);
  const [diaryContent, setDiaryContent] = useState("");
  const [title, setTitle] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");
  const [isSwitchPublic, setIsSwitchPublic] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (event) => {
    setIsSwitchPublic(event.target.checked);
    console.log(`Diary is now ${event.target.checked ? "공개" : "비공개"}`);
  };

  const saveDiary = async () => {
    if (!title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "제목이 입력되지 않았습니다",
        text: "일기장 제목을 입력하세요",
      });
      return;
    }
    if (!diaryContent.trim()) {
      Swal.fire({
        icon: "warning",
        title: "본문이 작성되지 않았습니다",
        text: "일기장 본문을 입력하세요",
      });
      return;
    }
    try {
      // 날씨 상태 코드 받아오기
      const weatherStatusCode = await getWeatherStatusCode(latitude, longitude);

      // 백엔드에서 날씨 아이콘 받기
      const icon = await getWeatherIconFromBackend(weatherStatusCode);
      setWeatherIcon(icon); // 날씨 아이콘 상태 업데이트

      const diaryData = {
        diaryTitle: title,
        diaryContent: diaryContent,
        isPublic: isSwitchPublic,
        weatherIcon: icon,
      };

      console.log(diaryData);
      console.log(diaryData.isPublic);

      // 일기 데이터와 날씨 아이콘을 서버에 전송
      const response = await instance.post(`/diary/save`, diaryData);

      if (response.status === 200) {
        alert("일기가 저장되었습니다!");
      }
    } catch (error) {
      console.error("일기 저장 중 오류 발생:", error);
      alert("일기 저장에 실패했습니다.");
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Diary</h1>
      </header>
      <div className="container">
        <aside className="sidebar-left"></aside>
        <main className="main-content">
          <div className="diary-container">
            <header className="diary-header">
              <h1>새로운 일기 작성</h1>
            </header>
            <main className="diary-main">
              <div className="diary-title">
                <label htmlFor="title-input">제목</label>
                <input
                  id="title-input"
                  type="text"
                  placeholder="일기 제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="diary-editor">
                <label htmlFor="editor">본문</label>
                <TextEditor
                  onEditorChange={(content) => setDiaryContent(content)}
                  className="custom-editor"
                />
              </div>
              <div className="switch-container">
                <span className="switch-label">
                  {isSwitchPublic ? "공개" : "비공개"}
                </span>
                <Switch checked={isSwitchPublic} onChange={handleToggle} />
              </div>
              <div className="diary-footer">
                <button
                  className="save-button"
                  onClick={saveDiary}
                  disabled={isSaving}
                >
                  {isSaving ? "저장 중..." : "저장"}
                </button>
              </div>
            </main>
          </div>
        </main>
        <aside className="sidebar-right">
          <div className="profile"></div>
          <button>Follow</button>
          <button>Chatting</button>
        </aside>
      </div>
    </div>
  );
};

export default DiaryComponent;
