import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo, getUserInfo } from "../../hooks/userSlice";
import "../../css/UserPage.css";
import instance from "../../instance/instance";
import HomeIcon from "../../components/HomeIcon";
import NotificationIcon from "../../components/NotificationIcon";
import NotificationModal from "../../components/NotificationModal";
import useChatAlerts from "../../hooks/useChatAlerts";

const UserPage = () => {
  const { username } = useParams(); // URL에서 username 파라미터를 가져옴
  const dispatch = useDispatch();
  const userInfo = useSelector(getUserInfo);
  const [isFriend, setIsFriend] = useState(false); // 친구 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [profileImage, setProfileImage] = useState("/img/default-profile.png"); // 기본 프로필 이미지
  const { chatAlerts, isModalOpen, openModal, closeModal } = useChatAlerts(); // 채팅 알림 훅
  const location = useLocation();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  useEffect(() => {
    const userId = location.pathname.split("/").pop(); // URL에서 유저 ID 추출

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await instance.get(`/user/${username}`);
        console.log("User data:", res.data); // 서버에서 받은 데이터 구조를 확인

        // 프로필 이미지 URL 확인 후 설정
        const profileImgUrl = res.data?.profileImage
          ? `${process.env.REACT_APP_HOST}/file/view/${res.data.profileImage}`
          : "/img/default-profile.png";
        console.log("Profile image URL:", profileImgUrl);

        setProfileImage(profileImgUrl); // 이미지 URL 설정

        setUserId(res.data?.USERID);

        // userId가 정상적으로 존재하는지 확인
        const userId = res?.data?.USERID;
        if (!userId) {
          throw new Error("User ID가 존재하지 않습니다.");
        }

        // 친구 상태 확인
        const friendRes = await instance.get(
          `/social/friendSearch?userID=${userId}`
        );
        console.log(friendRes);

        // 친구 상태 확인
        setIsFriend(
          friendRes.data.some((friend) => friend.username === username)
        ); // username으로 친구 상태 확인
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, userInfo.id, dispatch]);

  // 친구 추가 요청 핸들러
  const handleAddFriend = async () => {
    try {
      const response = await instance.post(
        `/social/user/friendRequest/${userId}`,
        {}
      );
      if (response.status === 200) {
        alert("친구 요청이 전송되었습니다.");
        setIsFriend(true); // 친구 요청 성공 후 상태 업데이트
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
        <h2>{loading ? "Loading..." : `${username}님의 프로필`}</h2>
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
                    src={profileImage}
                    alt={username || "default"}
                    className="profile-image"
                  />
                </div>
                <div className="profile-details">
                  <h3>{loading ? "Loading..." : `${username}`}</h3>
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
