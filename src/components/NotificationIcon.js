import React, { useState, useEffect } from "react";
import NotificationModal from "./NotificationModal";
import "../css/NotificationIcon.css";

const NotificationIcon = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatAlerts, setChatAlerts] = useState([]); // 채팅 알림 목록

  // 모달 열기/닫기 토글
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    // 서버와의 SSE 연결
    const eventSource = new EventSource("/message/subscribe");

    // 메시지 수신 처리
    eventSource.onmessage = function (event) {
      const newMessage = JSON.parse(event.data); // 서버에서 보내는 데이터 (JSON 파싱)
      console.log("새로운 메시지:", newMessage);

      // 알림 목록에 새 메시지 추가
      setChatAlerts((prevAlerts) => [...prevAlerts, newMessage.message]);
    };

    // 연결 오류 처리
    eventSource.onerror = function (error) {
      console.error("SSE 연결 오류:", error);
      eventSource.close(); // 오류 발생 시 연결 종료
    };

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      eventSource.close();
    };
  }, []);

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
