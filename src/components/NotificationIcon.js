import React from "react";
import { useState } from "react";
import NotificationModal from "./NotificationModal"; // 모달 컴포넌트 임포트
import "../css/NotificationIcon.css";

const NotificationIcon = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatAlerts, setChatAlerts] = useState(["새로운 채팅 알림"]); // 채팅 알림 예시

  // 모달 열기/닫기 토글 함수
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="notification-container">
      <img
        src="/img/bellicon.png"
        alt="bellicon"
        className="notification-icon"
        onClick={toggleModal}
      />

      <NotificationModal
        isOpen={isModalOpen}
        closeModal={toggleModal}
        chatAlerts={chatAlerts}
      />
    </div>
  );
};

export default NotificationIcon;
