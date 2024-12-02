import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TextEditor from "../../components/TextEditorComponent";
import { Switch } from "@mui/material";
import Swal from "sweetalert2";
import instance from "../../instance/instance";


const DiaryEdit = () => {
  const [diaryContent, setDiaryContent] = useState("");
  const [title, setTitle] = useState("");
  const [isSwitchPublic, setIsSwitchPublic] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 스위치 토글 클릭 시 값 변경
  const handleToggle = (event) => {
    setIsSwitchPublic(event.target.checked);
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
    <div className="app">
      <header className="header">
        <h1>Diary</h1>
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
              <li className={isActive("/setting")}>
                <Link to="/setting">Setting</Link>
              </li>
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
                  onClick={updateDiary}
                  disabled={isSaving}
                >
                  {isSaving ? "수정 중..." : "수정"}
                </button>
              </div>
            </main>
          </div>
        </main>
        <aside className="sidebar-right">/*추후 내용 추가*/</aside>
      </div>
    </div>
  );
};

export default DiaryEdit;
