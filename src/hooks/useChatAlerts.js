import { useState, useEffect } from "react";

const useChatAlerts = () => {
  const [chatAlerts, setChatAlerts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 열기/닫기 함수
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // SSE 연결 및 알림 수신
  useEffect(() => {
    const fetchChatAlerts = async () => {
      // API 호출을 통해 알림 데이터를 가져오는 부분
      // 예시로 임시 데이터를 설정합니다.
      const newAlerts = ["새로운 채팅 알림", "또 다른 알림"];
      setChatAlerts(newAlerts);
    };

    fetchChatAlerts(); // 알림 데이터 가져오기
  }, []);

  return {
    chatAlerts,
    isModalOpen,
    openModal,
    closeModal,
  };
};

export default useChatAlerts;
