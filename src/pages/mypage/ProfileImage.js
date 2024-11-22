import React, { useState } from "react";
import "../../css/ProfileImage.css";

const ProfileImage = () => {
  // 상태 변수들
  const [profileImage, setProfileImage] = useState("/img/default-profile.png"); // 기본 프로필 이미지
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const [newImage, setNewImage] = useState(null); // 새로 업로드할 이미지 파일
  // 프로필 이미지 변경 처리
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result); // 파일이 읽히면 미리보기용 이미지 설정
      };
      reader.readAsDataURL(file); // 이미지 파일을 읽기
    }
  };

  // 프로필 이미지 업로드 처리
  const handleImageUpload = async () => {
    if (newImage) {
      // 업로드된 이미지 파일을 서버에 전송하는 코드
      setProfileImage(newImage); // 서버에 업로드 후, 새 프로필 이미지로 업데이트
      setNewImage(null); // 새 이미지 상태 초기화
      setIsModalOpen(false); // 모달 닫기
    } else {
      alert("변경할 이미지를 선택하세요.");
    }
  };

  // 프로필 이미지 삭제 처리
  const handleImageDelete = () => {
    // 서버에서 이미지를 삭제하는 코드 작성
    setProfileImage("/img/default-profile.png"); // 기본 이미지로 초기화
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <div className="UserProfile">
      <header className="header">
        <h1>Diary</h1>
      </header>
      <div className="container">
        <aside className="sidebar-left"></aside>
        <main className="main-content">
          <div className="diary-entries">{}</div>
        </main>
        <aside className="sidebar-right">
          <div className="profile">
            <img src={profileImage} alt="Profile" className="profile-image" />

            {/* 연필 아이콘 */}
            <img
              src="/img/pencil.png"
              alt="Edit"
              className="edit-icon"
              onClick={() => setIsModalOpen(true)} // 연필 아이콘 클릭시 모달 열기
            />
          </div>

          {/* 모달 창 */}
          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <h2>프로필 사진 변경</h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                <button onClick={handleImageUpload}>프로필 사진 업로드</button>
                <button onClick={handleImageDelete}>프로필 사진 삭제</button>
                <button onClick={() => setIsModalOpen(false)}>취소</button>
              </div>
            </div>
          )}

          <button>Follow</button>
          <button>Chatting</button>
        </aside>
      </div>
    </div>
  );
};

export default ProfileImage;
