import { useEffect, useState } from "react";
import HomeIcon from "../../components/HomeIcon";
import NotificationIcon from "../../components/NotificationIcon";
import NotificationModal from "../../components/NotificationModal";
import useChatAlerts from "../../hooks/useChatAlerts";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import "../../css/DiarySetting.css";
import instance from "../../instance/instance";
import Swal from "sweetalert2";

const Setting = () => {
  const { chatAlerts, isModalOpen, openModal, closeModal } = useChatAlerts();

  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");
  const userInfo = useSelector(getUserInfo);

  const Settings = () => {
    const [userEmail, setUserEmail] = useState("");
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [passwordChk, setPasswordChk] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
      instance
        .get("/social/meProFiles", {
          params: {
            userId: userInfo.id,
          },
        })
        .then((res) => {
          setUserId(res.data.USERNAME);
          setUserEmail(res.data.EMAIL);
          setUserName(res.data.NAME);
        });
    }, []);

    const handleSave = () => {
      if (!userName.trim()) {
        Swal.fire({
          title: "Error",
          text: "성함을 작성해주세요.",
          icon: "error",
        });
        return;
      }

      if (password.trim()) {
        if (password !== passwordChk) {
          Swal.fire({
            title: "Error",
            text: "비밀번호가 맞지 않습니다.",
            icon: "error",
          });
          return;
        }
        

      }
    };

    const handleUserDelete = () => {

    }

    return (
      <>
        {/* 중단: 회원 정보 수정 */}
        <div className="profile-info-section">
          <div className="profile-info-item">
            <label>이메일</label>
            <input type="email" value={userEmail} readOnly />
          </div>
          <div className="profile-info-item">
            <label>아이디</label>
            <input type="text" value={userId} readOnly />
          </div>
          <div className="profile-info-item">
            <label>성함</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="profile-info-item">
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="변경할 비밀번호를 넣어주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="profile-info-item">
            <label>비밀번호 확인</label>
            <input
              type="password"
              placeholder="변경할 비밀번호를 다시한번 입력해주세요."
              value={passwordChk}
              onChange={(e) => setPasswordChk(e.target.value)}
            />
          </div>
          <button type='button' onClick={handleUserDelete}>회원탈퇴</button>
        </div>

        {/* 하단: 회원 탈퇴 */}
        <div className="profile-actions">
          <button className="profile-save-button" onClick={handleSave}>
            저장
          </button>
          <button
            className="profile-delete-button"
            onClick={() => console.log("취소")}
          >
            취소
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="UserProfile">
      <header className="header">
        <img src="/img/logo.png" alt="logo" className="logo" />
        <h2>Main</h2>
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
          {/* 여기에 구성 */}

          <Settings />
        </main>
        <aside className="sidebar-right">
          <div className="profile">{/* details */}</div>
        </aside>
      </div>
    </div>
  );
};

export default Setting;
