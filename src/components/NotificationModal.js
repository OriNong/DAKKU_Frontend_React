import React from "react";
import "../css/NotificationModal.css";

const NotificationModal = ({ isOpen, closeModal, chatAlerts }) => {
  if (!isOpen) return null; // 모달이 열려 있지 않으면 아무것도 렌더링하지 않음

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <h3>채팅 알림</h3>
        <ul>
          {chatAlerts.map((alert, index) => (
            <li key={index}>{alert}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationModal;
