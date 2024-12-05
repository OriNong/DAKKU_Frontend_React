import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Switch } from "@mui/material";
import Swal from "sweetalert2";
import {
  getWeatherStatusCode,
  getWeatherIconFromBackend,
} from "../../services/WeatherService";
import instance from "../../instance/instance";
import NotificationIcon from "../../components/NotificationIcon";
import HomeIcon from "../../components/HomeIcon";
import NotificationModal from "../../components/NotificationModal";
import useChatAlerts from "../../hooks/useChatAlerts";
import TextEditor from "../../components/TextEditorComponent";
import { getUserInfo } from "../../hooks/userSlice";
import "../../css/DiaryWritePage.css";
import SideBarRight from "./DiarySideRight";
import SideBarLeft from "./DiarySideLeft";

const DiaryComponent = () => {
  // 채팅 알림 훅
  const { chatAlerts, isModalOpen, openModal, closeModal } = useChatAlerts();

  const userInfo = useSelector(getUserInfo);
  const [latitude, setLatitude] = useState(37.5666791);
  const [longitude, setLongitude] = useState(126.9782914);
  const [diaryContent, setDiaryContent] = useState("");
  const [title, setTitle] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");
  const [isSwitchPublic, setIsSwitchPublic] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 스위치 토글 클릭 시 값 변경
  const handleToggle = (event) => {
    setIsSwitchPublic(event.target.checked);
    console.log(`Diary is now ${event.target.checked ? "공개" : "비공개"}`);
  };
  console.log(userInfo.id);

  const navigate = useNavigate();
  const navToDiaryList = () => {
    navigate("/user/myDiary");
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
        Swal.fire({
          icon: "success",
          title: "일기 저장 성공!",
          text: "작성한 일기가 저장되었습니다",
          timer: 3000,
          timerProgressBar: true,
          didClose: () => {
            navToDiaryList();
          },
        });
      }
    } catch (error) {
      console.error("일기 저장 중 오류 발생:", error);
      Swal.fire({
        icon: "error",
        title: "Diary Save Error!",
        text: "일기 저장에 실패했습니다",
        timer: 1500,
        timerProgressBar: true,
        didClose: () => {
          navToDiaryList();
        },
      });
    }
  };

  return (
    <div className="DiaryWrite">
      <header className="header">
        <img src="/img/logo.png" alt="logo" className="logo" />
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
                  onEditorChange={(content) => {
                    console.log(content);
                    setDiaryContent(content);
                  }}
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
          <SideBarRight />
        </aside>
      </div>
    </div>
  );
};

export default DiaryComponent;
