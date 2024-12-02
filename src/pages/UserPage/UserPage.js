import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import "../../css/UserPage.css";
import instance from "../../instance/instance";
import HomeIcon from "../../components/HomeIcon";
import NotificationIcon from "../../components/NotificationIcon";
import NotificationModal from "../../components/NotificationModal";
import useChatAlerts from "../../hooks/useChatAlerts";

const UserPage = () => {
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null); // 프로필 유저 정보
  const [isFriend, setIsFriend] = useState(false); // 친구 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const { chatAlerts, isModalOpen, openModal, closeModal } = useChatAlerts(); // 채팅 알림 훅

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  // 유저 프로필 및 친구 상태 가져오기
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const userId = location.pathname.split("/").pop(); // URL에서 유저 ID 추출
        const userResponse = await instance.get(`/user/${userId}`); // 프로필 유저 정보 API
        const friendResponse = await instance.get(`/social/${userId}`); // 친구 관계 API

        setUserInfo(userResponse.data);
        setIsFriend(friendResponse.data.length > 0); // 친구 관계 여부
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [location]);

  // 친구 추가 요청 핸들러
  const handleAddFriend = async () => {
    try {
      const response = await instance.post(
        `/social/user/friendRequest/${userInfo.id}`
      );
      if (response.status === 200) {
        alert("친구 요청이 전송되었습니다.");
      }
    } catch (error) {
      console.error("Failed to send friend request", error);
      alert("친구 요청 실패");
    }
  };

  return (
    <div className="UserProfile">
      <header className="header">
        <img src="/img/logo.png" alt="logo" className="logo" />
        <h2>{userInfo ? `${userInfo.name}님의 프로필` : "프로필"}</h2>
        <div className="header-icons">
          <NotificationIcon />
          <HomeIcon />
        </div>
        <NotificationModal
          isOpen={isModalOpen} // 모달 상태
          closeModal={closeModal} // 모달 닫기 함수
          chatAlerts={chatAlerts} // 알림 데이터
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
              <li className={isActive("/setting")}>
                <Link to="/setting">Setting</Link>
              </li>
            </ul>
          </div>
        </aside>
        <main className="main-content">
          <div className="profile-container">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="profile-info">
                <div className="profile-image-container">
                  <img
                    src={userInfo?.profileImage || "/img/default-profile.png"}
                    alt="Profile"
                    className="profile-image"
                  />
                </div>
                <div className="profile-details">
                  <h3>{userInfo?.name}</h3>
                  <p>{userInfo?.bio || "소개글이 없습니다."}</p>
                </div>
                <button
                  onClick={handleAddFriend}
                  className={`friend-button ${isFriend ? "complete" : ""}`}
                  disabled={isFriend}
                >
                  {isFriend ? "Following" : "Follow"}
                </button>
              </div>
            )}
          </div>
          <div className="diary">다이어리</div>
        </main>
        <aside className="sidebar-right"></aside>
      </div>
    </div>
  );
};

export default UserPage;
