import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import TextEditor from "../../components/TextEditorComponent";
import { Switch } from "@mui/material";
import Swal from "sweetalert2";
import instance from "../../instance/instance";
<<<<<<< HEAD
import SideBarRight from './DiarySideRight';
import { useSelector } from 'react-redux';
import { getUserInfo } from '../../hooks/userSlice';
=======
import NotificationIcon from "../../components/NotificationIcon";
import HomeIcon from "../../components/HomeIcon";
import NotificationModal from "../../components/NotificationModal";
import useChatAlerts from "../../hooks/useChatAlerts";
import SideBarRight from "./DiarySideRight";
>>>>>>> 76d9ae208f6da84c757d8b6ca273bcfe30a92987

import "../../css/DiaryEditPage.css";

const DiaryEdit = () => {
  const { selectedDiaryId } = useParams(); // URL에서 일기 ID 추출
  // 선택된 일기를 entryDiary에 저장
  const [entryDiary, setEntryDiary] = useState({
    diaryContent: "",
    diaryTitle: "",
    public: false,
  });
  // 서버에서 수정할 일기를 가져온다
  useEffect(() => {
    const fetchSelectedDiary = async () => {
      try {
        const response = await instance.get(`/diary/select/${selectedDiaryId}`);
        console.log(response);
        setEntryDiary(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSelectedDiary();
    // setTitle(entryDiary.diaryTitle);
    // setDiaryContent(entryDiary.diaryContent);
    // setIsSwitchPublic(entryDiary.public);
  }, []);

  const [diaryContent, setDiaryContent] = useState("");
  const [title, setTitle] = useState("");
  const [isSwitchPublic, setIsSwitchPublic] = useState("");
  const [isSaving, setIsSaving] = useState(false);

<<<<<<< HEAD
  const userInfo = useSelector(getUserInfo);
=======
  // 서버에서 가져온 일기로 기본 값 설정

  // 채팅 알림 훅
  const { chatAlerts, isModalOpen, openModal, closeModal } = useChatAlerts();
>>>>>>> 76d9ae208f6da84c757d8b6ca273bcfe30a92987

  // 스위치 토글 클릭 시 값 변경
  const handleToggle = (event) => {
    setEntryDiary({ ...entryDiary, public: event.target.checked });
    console.log(`Diary is now ${event.target.checked ? "공개" : "비공개"}`);
  };

  // 수정된 일기 내용 update
  const updateDiary = async () => {
    if (!title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "제목이 입력되지 않았습니다",
        text: "일기장 제목을 다시 확인하세요",
      });
      return;
    }
    if (!diaryContent.trim()) {
      Swal.fire({
        icon: "warning",
        title: "본문이 작성되지 않았습니다",
        text: "일기장 본문을 다시 확인하세요",
      });
      return;
    }
    try {
      // 수정된 일기 내용
      const updatedDiary = {
        diaryTitle: title,
        diaryContent: diaryContent,
        isPublic: isSwitchPublic,
      };
      // 수정된 일기 데이터 서버에 전송
      const response = await instance.put(
        `/diary/update/{diaryId}`,
        updatedDiary
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "일기 수정 성공!",
          text: "작성한 일기가 수정되었습니다",
        });
      }
    } catch (error) {
      console.error("일기 수정 실패 : ", error);
      Swal.fire({
        icon: "error",
        title: "Diary Update Error!",
        text: "오류 : " + error,
      });
    }
  };

  // 현재 경로가 active 상태인지 확인
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <div className="DiaryEdit">
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
          <div className="sidebar-content">
            <ul>
              <li className={isActive("/MainPage")}>
                <Link to="/MainPage">Main</Link>
              </li>
              <li className={isActive("/chat")}>
                <Link to="/chat">Chat</Link>
              </li>
              <li className={isActive("/ProfileImage")}>
                <Link to="/ProfileImage">MyPage</Link>
              </li>
              <li className={isActive("/notice")}>
                <Link to="/notice">Notice</Link>
              </li>
              {userInfo.id > 0 && (
                <li className={isActive("/setting")}>
                  <Link to="/setting">Setting</Link>
                </li>
              )}
            </ul>
          </div>
        </aside>
        <main className="main-content">
          <div className="diary-container">
            <header className="diary-header">
              <h1>작성된 일기 수정</h1>
            </header>
            <main className="diary-main">
              <div className="diary-title">
                <label htmlFor="title-input">제목</label>
                <input
                  id="title-input"
                  type="text"
                  placeholder="일기 제목을 입력하세요"
                  value={entryDiary.diaryTitle}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="diary-editor">
                <label htmlFor="editor">본문</label>
                <TextEditor
                  value={entryDiary.diaryContent}
                  onEditorChange={(content) =>
                    setEntryDiary({ ...entryDiary, diaryContent: content })
                  }
                  className="custom-editor"
                />
              </div>
              <div className="switch-container">
                <span className="switch-label">
                  {entryDiary.public ? "공개" : "비공개"}
                </span>
                <Switch checked={entryDiary.public} onChange={handleToggle} />
              </div>
              <div className="diary-footer">
                <button
                  className="save-button"
                  onClick={updateDiary}
                  disabled={isSaving}
                >
                  {isSaving ? "수정 중..." : "수정"}
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

export default DiaryEdit;
