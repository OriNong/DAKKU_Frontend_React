import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Switch } from "@mui/material";
import Swal from "sweetalert2";
import TextEditor from "../../components/TextEditorComponent";
import { getUserInfo } from "../../hooks/userSlice";
import useChatAlerts from "../../hooks/useChatAlerts";
import instance from "../../instance/instance";
import SideBarRight from "../../components/SideBarRight";
import NotificationIcon from "../../components/NotificationIcon";
import HomeIcon from "../../components/HomeIcon";
import NotificationModal from "../../components/NotificationModal";

import "../../css/DiaryEditPage.css";
import SideBarLeft from "../../components/SideBarLeft";

const DiaryEdit = () => {
  // 현재 경로가 active 상태인지 확인
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");

  // 서버에서 가져온 일기로 기본 값 설정
  // const { selectedDiaryId } = useParams(); // URL에서 일기 ID 추출
  // 선택된 일기를 entryDiary에 저장
  const [entryDiary, setEntryDiary] = useState({
    diaryContent: "",
    diaryTitle: "",
    public: false,
  });
  // 서버에서 수정할 일기를 가져온다
  useEffect(() => {
    console.log(location);
    instance
      .get(`/diary/select/${location.state?.selectedDiaryId}`)
      .then((res) => {
        setEntryDiary(res.data);
        setTimeout(() => {
          setEntryDiary(res.data);
        }, 100);
      });
  }, [location.state?.selectedDiaryId]);
  console.log(entryDiary);

  if (entryDiary.diaryTitle === null){
    console.log("새로고침");
    window.location.reload();
  }

  const [isSaving, setIsSaving] = useState(false);
  const userInfo = useSelector(getUserInfo);
  // 채팅 알림 훅
  const { chatAlerts, isModalOpen, openModal, closeModal } = useChatAlerts();

  // 스위치 토글 클릭 시 값 변경
  const handleToggle = (event) => {
    setEntryDiary({ ...entryDiary, isPublic: event.target.checked });
    console.log(`Diary is now ${event.target.checked ? "공개" : "비공개"}`);
  };
  const [isLoading, setIsLoading] = useState(false);
  const handleUpdatePublic = async (diaryId) => {
    setIsLoading(true);

    // try {
    //   instance.put(`/diary/update`)
    // }
  }

  // 수정된 일기 내용 update
  const updateDiary = async () => {
    if (!entryDiary.diaryTitle.trim()) {
      Swal.fire({
        icon: "warning",
        title: "제목이 입력되지 않았습니다",
        text: "일기장 제목을 다시 확인하세요",
      });
      return;
    }
    if (!entryDiary.diaryContent.trim()) {
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
        diaryTitle: entryDiary.diaryTitle,
        diaryContent: entryDiary.diaryContent,
        isPublic: entryDiary.isPublic,
      };
      // 수정된 일기 데이터 서버에 전송
      const response = await instance.put(
        `/diary/update/${location.state?.selectedDiaryId}`,
        updatedDiary
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "일기 수정 성공!",
          text: "작성한 일기가 수정되었습니다",
          // 알림창 1.5초 뒤 자동으로 닫힘
          timer: 1500,
          timerProgressBar: true,
          // 알림창 닫혔을 때 페이지 새로 고침
          didClose: () => {
            navigate("/diary/myDiary");
          },
        });
      }
    } catch (error) {
      console.error("일기 수정 실패 : ", error);
      Swal.fire({
        icon: "error",
        title: "Diary Update Error!",
        text: "일기 수정에 실패했습니다",
        didClose: () => {
          navigate("/diary/myDiary");
        }
      });
    }
  };

  // 취소 버튼 클릭 시 일기 목록으로 이동
  const navigate = useNavigate();
  const cancelEdit = () => {
    navigate("/diary/myDiary");
  };

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
          <SideBarLeft />
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
                  onChange={(e) =>
                    setEntryDiary({ ...entryDiary, diaryTitle: e.target.value })
                  }
                />
              </div>
              <div className="diary-editor">
                <label htmlFor="editor">본문</label>
                <TextEditor
                  onEditorChange={(content) =>
                    setEntryDiary({ ...entryDiary, diaryContent: content })
                  }
                  initialContent={entryDiary.diaryContent}
                  className="custom-editor"
                />
              </div>
              <div className="switch-container">
                <span className="switch-label">
                  {entryDiary.isPublic ? "공개" : "비공개"}
                </span>
                <Switch checked={entryDiary.isPublic} onChange={handleToggle} />
              </div>
              <div className="diary-footer">
                <button
                  className="diary-edit-btn"
                  onClick={updateDiary}
                  disabled={isSaving}
                >
                  {isSaving ? "수정 중..." : "수정"}
                </button>
                <button className="diary-edit-cancel-btn" onClick={cancelEdit}>
                  취소
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
