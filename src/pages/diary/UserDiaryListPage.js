import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import instance from "../../instance/instance";
import "../../css/UserDiaryListPage.css";

const UserDiaryListPage = ({ userId }) => {
  const [diaries, setDiaries] = useState([]);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // userId가 없으면 API 호출 방지
    if (!userId) {
      setDiaries([]);
      return;
    }

    const fetchUserDiaryList = async () => {
      try {
        setIsLoading(true);
        const response = await instance.get(`/diary/memberDiaries/${userId}`);
        setDiaries(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("일기 목록 불러오기 실패:", error);
        setIsLoading(false);
        Swal.fire({
          icon: "error",
          title: "오류",
          text: "일기 목록을 불러오는 중 문제가 발생했습니다.",
        });
      }
    };

    fetchUserDiaryList();
  }, [userId]); // userId가 변경될 때만 호출

  // 일기 목록 날짜 형식 변환 함수
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

  // Function to handle detail view
  const handleDetailView = (diary) => {
    setSelectedDiary(diary);
  };

  // Function to close detail view
  const closeDetailView = () => {
    setSelectedDiary(null);
  };

  // 로딩 상태 렌더링
  if (isLoading) {
    return <div className="user-diary-container loading">로딩 중...</div>;
  }

  return (
    <div className="user-diary-container">
      {/* Diary List */}
      {diaries.length === 0 ? (
        <div className="no-diaries">아직 작성된 일기가 없습니다.</div>
      ) : (
        <div className="diary-list">
          {diaries.map((diary) => (
            <div key={diary.diaryId} className="diary-item">
              <div className="diary-header">
                <span className="diary-title">{diary.diaryTitle}</span>
                <span className="diary-date">
                  {formatListDate(diary.diaryCrtDate)}
                </span>
                <span className="diary-weather">{diary.weatherIcon}</span>
              </div>
              <button
                className="detail-button"
                onClick={() => handleDetailView(diary)}
              >
                상세보기
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Diary Detail Modal */}
      {selectedDiary && (
        <div className="diary-detail-modal">
          <div className="diary-detail-content">
            <h2>{selectedDiary.diaryTitle}</h2>
            <p className="diary-detail-date">
              {formatSelectedDate(selectedDiary.diaryCrtDate)}{" "}
              {selectedDiary.weatherIcon}
            </p>
            <div className="diary-detail-text">
              <p
                dangerouslySetInnerHTML={{
                  __html: selectedDiary.diaryContent,
                }}
              ></p>
            </div>
            <button className="close-button" onClick={closeDetailView}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDiaryListPage;
