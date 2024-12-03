import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

import { getUserInfo } from "../../hooks/userSlice";
import instance from "../../instance/instance";
import NotificationIcon from "../../components/NotificationIcon";
import HomeIcon from "../../components/HomeIcon";
import NotificationModal from "../../components/NotificationModal";
import useChatAlerts from "../../hooks/useChatAlerts";

import "../../css/MyDiaryListPage.css";
import SideBarRight from './DiarySideRight';

const MyDiaryListPage = () => {
  // 채팅 알림 훅
  const { chatAlerts, isModalOpen, openModal, closeModal } = useChatAlerts();

  // 현재 경로가 active 상태인지 확인
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");

  // 새로운 일기 작성 버튼 클릭 시 일기 작성 페이지로 이동
  const navigate = useNavigate();
  const navToDiaryWrite = () => {
    navigate("/");
  };

  const userInfo = useSelector(getUserInfo);

  const [diaryList, setDiaryList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 서버에서 사용자가 작성한 일기 목록을 가져온다.
  useEffect(() => {
    const fetchUserDiaryList = async () => {
      try {
        const response = await instance.get(`/diary/myDiaries`);
        console.log(response.config);
        setDiaryList(response.data);
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "일기 목록 조회 에러",
          text: userInfo.id + "님의 일기 목록 조회 중 오류 발생",
        });
      }
    };
    fetchUserDiaryList();
  }, []);
  console.log(diaryList);

  // 공개/비공개 토글 핸들러
  const handlePublicToggle = (diaryId) => {
    setDiaryList((prevList) =>
      prevList.map((diary) =>
        diary.diaryId === diaryId ? { ...diary, public: !diary.public } : diary
      )
    );
  };

  const [selectedDiary, setSelectedDiary] = useState(null); // 상세보기용 상태

  // 날짜 형식 변환 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // 선택한 일기 데이터를 상태에 저장
  const handleViewDetails = (diary) => {
    setSelectedDiary(diary);
  };

  // 상세보기 화면 닫기
  const handleCloseDetails = () => {
    setSelectedDiary(null);
  };

  // 상세보기에서 일기 삭제 전 확인
  const handleDeleteConfirmation = (diaryId) => {
    Swal.fire({
      title: "정말 삭제하시겠습니까?",
      text: "삭제된 일기는 복구할 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "예, 삭제합니다",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteDiary(diaryId);
      }
    });
  };

  const handleDeleteDiary = async (diaryId) => {
    try {
      // diaryId를 파라미터로 전달하여 삭제 API 호출
      const response = await instance.delete(`/diary/delete/${diaryId}`);

      // 삭제 성공 시 알림

      Swal.fire({
        title: "삭제 완료",
        text: "일기가 성공적으로 삭제되었습니다.",
        icon: "success",
        timer: 1500,
        timerProgressBar: true,
        didClose: () => {
          window.location.reload();
        },
      });
    } catch (error) {
      // 삭제 실패 시 에러 알림
      Swal.fire({
        title: "삭제 오류",
        text: "일기 삭제 중 오류가 발생했습니다.",
        icon: "error",
      });
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="MyDiaryList">
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
          <div className="sidebar-left-content">
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
          <div className="diary-header">
            <h2>내 일기장 목록</h2>
            <button className="new-diary-btn" onClick={navToDiaryWrite}>
              새 일기 작성하기
            </button>
          </div>
          <main className="diary-main row">
            <div className={`diary-list ${selectedDiary ? "with-detail" : ""}`}>
              <table className="diary-table">
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성일</th>
                    <th>날씨</th>
                    <th>공개 여부</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {diaryList.map((diary, index) => (
                    <tr key={diary.diaryId}>
                      <td>{index + 1}</td>
                      <td>{diary.diaryTitle}</td>
                      <td>{formatDate(diary.diaryCrtDate)}</td>
                      <td>{diary.weatherIcon}</td>
                      <td>
                        <div className="diary-publicity-toggle">
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={diary.public}
                              onChange={() => handlePublicToggle(diary.diaryId)}
                            />
                            <span className="slider"></span>
                          </label>
                          <span>{diary.public ? "공개" : "비공개"}</span>
                        </div>
                      </td>
                      <td>
                        <button
                          className="view-details-btn"
                          onClick={() => handleViewDetails(diary)}
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedDiary && (
              <div className="diary-detail">
                <div className="diary-detail-header">
                  <h1>제목 : {selectedDiary.diaryTitle}</h1>
                  <p>작성일: {selectedDiary.diaryCrtDate}</p>
                  <p>날씨: {selectedDiary.weatherIcon}</p>
                </div>
                <div className="diary-detail-main">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: selectedDiary.diaryContent,
                    }}
                  ></p>
                </div>

                <div className="detail-actions">
                  <button className="edit-btn" onClick={() => {}}>
                    수정하기
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      handleDeleteConfirmation(selectedDiary.diaryId);
                    }}
                  >
                    삭제하기
                  </button>
                  <button
                    className="close-detail-btn"
                    onClick={handleCloseDetails}
                  >
                    닫기
                  </button>
                </div>
              </div>
            )}
          </main>
        </main>
        <aside className="sidebar-right"><SideBarRight /></aside>
      </div>
    </div>
  );
};

export default MyDiaryListPage;
