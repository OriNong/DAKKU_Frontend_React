import React, { useState } from "react";
import "../../css/ProfileImage.css";
import HomeIcon from "../../components/HomeIcon";
import useChatAlerts from "../../hooks/useChatAlerts";
import SideBarRight from "../../components/SideBarRight";
import SideBarLeft from "../../components/SideBarLeft";
import ProFileSetting from "./proFileSetting";

const ProfileImage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태

  // 채팅 알림 훅
  const { chatAlerts, openModal, closeModal } = useChatAlerts();

  return (
    <div className="UserProfile">
      <header className="header">
        <img src="/img/logo.png" alt="logo" className="logo" />
        <h2>MyPage</h2>
        <div className="header-icons">
          <HomeIcon />
        </div>
      </header>
      <div className="container">
        <aside className="sidebar-left">
          <SideBarLeft />
        </aside>
        <main className="main-content">
          <div className="diary-entries">
            <ProFileSetting />
          </div>
        </main>
        <aside className="sidebar-right">
          <SideBarRight />
        </aside>
      </div>
    </div>
  );
};

export default ProfileImage;
