import React, { useState } from "react";
import "../../css/ProfileImage.css";
import HomeIcon from "../../components/HomeIcon";
import NotificationIcon from "../../components/NotificationIcon";
import NotificationModal from "../../components/NotificationModal";
import useChatAlerts from "../../hooks/useChatAlerts";
import SideBarRight from '../../components/SideBarRight';
import SideBarLeft from "../../components/SideBarLeft"
import ProFileSetting from './proFileSetting';

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
