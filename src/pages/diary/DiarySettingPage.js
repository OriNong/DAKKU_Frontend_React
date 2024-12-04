import { Link, useLocation } from "react-router-dom";
import HomeIcon from "../../components/HomeIcon";
import NotificationIcon from "../../components/NotificationIcon";
import NotificationModal from "../../components/NotificationModal";
import Setting from "../mypage/Setting";
import useChatAlerts from "../../hooks/useChatAlerts";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";

const SettingPage = () => {
  const { chatAlerts, isModalOpen, openModal, closeModal } = useChatAlerts();

  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");
  const userInfo = useSelector(getUserInfo);

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
                <>
                  <li className={isActive("/setting")}>
                    <Link to="/setting">Setting</Link>
                  </li>
                  <li className={isActive("/Logout")}>
                    <Link to="/Logout">Logout</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </aside>
        <main className="main-content">
          <Setting />
        </main>
        <aside className="sidebar-right">
          <div className="profile">{/* details */}</div>
        </aside>
      </div>
    </div>
  );
};

export default SettingPage;
