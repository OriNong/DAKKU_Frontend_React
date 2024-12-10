import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

import { getUserInfo } from "../../hooks/userSlice";
import instance from "../../instance/instance";
import HomeIcon from "../../components/HomeIcon";

import "../../css/MyDiaryListPage.css";
import SideBarLeft from "../../components/SideBarLeft";
import SideBarRight from "../../components/SideBarRight";

const MyDiaryListPage = () => {
  // 현재 경로가 active 상태인지 확인
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");

  // 일기 작성 페이지로 이동
  const navigate = useNavigate();
  const navToDiaryWrite = () => {
    navigate("/diary/writeDiary");
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
  const handlePublicToggle = async (diaryId, currentIsPublic) => {
    try {
      // 즉시 UI 상태 업데이트
      const updatedDiaryList = diaryList.map((diary) =>
        diary.diaryId === diaryId
          ? { ...diary, isPublic: !currentIsPublic }
          : diary
      );
      setDiaryList(updatedDiaryList);

      // 백엔드 컨트롤러에 맞춰 요청 방식 수정
      const response = await instance.put(
        `/diary/updatePublic/${diaryId}`,
        null,
        {
          params: {
            isPublic: !currentIsPublic,
          },
        }
      );

      // 성공 알림
      Swal.fire({
        icon: "success",
        title: "공개 설정 변경",
        text: `일기가 ${
          !currentIsPublic ? "공개" : "비공개"
        }로 변경되었습니다.`,
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      // 롤백 및 에러 처리
      const rollbackDiaryList = diaryList.map((diary) =>
        diary.diaryId === diaryId
          ? { ...diary, isPublic: currentIsPublic }
          : diary
      );
      setDiaryList(rollbackDiaryList);

      // 에러 상세 로깅
      console.error("Diary publicity update error:", error.response);

      // 에러 알림
      Swal.fire({
        icon: "error",
        title: "설정 변경 실패",
        text: error.response?.data?.message || "공개 범위 수정 중 오류 발생",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const [selectedDiary, setSelectedDiary] = useState(null); // 상세보기용 상태

  // 일기 목록 날짜 형식 변환 함수
  // $년 $월 $일
  const formatListDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const daysOfWeek = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = daysOfWeek[date.getDay()];

    return `${year}년 ${month}월 ${day}일 ${dayOfWeek}`;
  };
  // 상세 보기 시 날짜 형식 변환 함수
  // $년 $월 $일 $요일 $시 $분
  const formatSelectedDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const daysOfWeek = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = daysOfWeek[date.getDay()];
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}년 ${month}월 ${day}일 ${dayOfWeek} ${hours}시 ${minutes}분`;
  };

  // 선택한 일기 데이터를 상태에 저장
  const handleViewDetails = (diary) => {
    setSelectedDiary(diary);
  };

  // 상세보기 화면 닫기
  const handleCloseDetails = () => {
    setSelectedDiary(null);
  };

  // 일기 수정 시
  const handleEditDiary = (selectedDiaryId) => {
    // 일기 수정 페이지로 이동
    console.log(selectedDiaryId);
    navigate(`/diary/editDiary`, {
      state: {
        selectedDiaryId: selectedDiaryId,
      },
    });
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
  // 서버에 저장된 일기 삭제 수행
  const handleDeleteDiary = async (diaryId) => {
    try {
      // diaryId를 파라미터로 전달하여 삭제 API 호출
      const response = await instance.delete(`/diary/delete/${diaryId}`);
      // 삭제 성공 시 알림
      Swal.fire({
        title: "삭제 완료",
        text: "일기가 성공적으로 삭제되었습니다.",
        icon: "success",
        // 알림창 1.5초 뒤 자동으로 닫힘
        timer: 1500,
        timerProgressBar: true,
        // 알림창 닫혔을 때 페이지 새로 고침
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
          <HomeIcon />
        </div>
      </header>
      <div className="container">
        <aside className="sidebar-left">
          <SideBarLeft />
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
                      <td>{formatListDate(diary.diaryCrtDate)}</td>
                      <td>{diary.weatherIcon}</td>
                      <td>
                        <div className="diary-publicity-toggle">
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={diary.isPublic}
                              onChange={() => {
                                handlePublicToggle(
                                  diary.diaryId,
                                  diary.isPublic
                                );
                              }}
                            />
                            <span className="slider"></span>
                          </label>
                          <span>{diary.isPublic ? "공개" : "비공개"}</span>
                        </div>
                      </td>
                      <td>
                        <button
                          className={`view-details-btn ${
                            selectedDiary === diary ? "selected" : ""
                          }`}
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
                <header className="diary-detail-header">
                  <h1>제목 : {selectedDiary.diaryTitle}</h1>
                  <p>
                    작성일: {formatSelectedDate(selectedDiary.diaryCrtDate)}
                  </p>
                  <p>날씨: {selectedDiary.weatherIcon}</p>
                </header>
                <main className="diary-detail-main">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: selectedDiary.diaryContent,
                    }}
                  ></p>
                </main>

                <footer className="detail-actions">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      handleEditDiary(selectedDiary.diaryId);
                      console.log(selectedDiary.diaryId);
                    }}
                  >
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
                </footer>
              </div>
            )}
          </main>
        </main>
        <aside className="sidebar-right">
          <SideBarRight />
        </aside>
      </div>
    </div>
  );
};

export default MyDiaryListPage;
