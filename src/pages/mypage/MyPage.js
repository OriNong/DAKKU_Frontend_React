import React, { useState } from "react";
import Swal from "sweetalert2";

import NotificationIcon from "../../components/NotificationIcon";
import HomeIcon from "../../components/HomeIcon";
import NotificationModal from "../../components/NotificationModal";
import useChatAlerts from "../../hooks/useChatAlerts";
import SideBarLeft from "../../components/SideBarLeft";
import SideBarRight from "../../components/SideBarRight";

import "../../css/MyPage.css";

const MyPage = () => {
  const { chatAlerts, isModalOpen, openModal, closeModal } = useChatAlerts();

  const [activeTab, setActiveTab] = useState("friendRequests"); // 친구 요청/친구 목록 탭
  const [requestTab, setRequestTab] = useState("received"); // 받은 요청/보낸 요청 탭

  const friendRequestsReceived = [
    { id: 1, name: "김철수" },
    { id: 2, name: "박영희" },
  ];

  const friendRequestsSent = [
    { id: 1, name: "이민수" },
    { id: 2, name: "최정호" },
  ];

  const friendList = [
    { id: 1, name: "홍길동" },
    { id: 2, name: "김영호" },
  ];

  return (
    <div className="MyDiaryList">
      <header className="header">
        <img src="/img/logo.png" alt="logo" className="logo" />

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
          <div className="tabs">
            <button
              className={`tab ${
                activeTab === "friendRequests" ? "active" : ""
              }`}
              onClick={() => setActiveTab("friendRequests")}
            >
              친구 요청
            </button>
            <button
              className={`tab ${activeTab === "friends" ? "active" : ""}`}
              onClick={() => setActiveTab("friends")}
            >
              친구 목록
            </button>
          </div>

          {activeTab === "friendRequests" && (
            <div className="friend-requests">
              <div className="sub-tabs">
                <button
                  className={`sub-tab ${
                    requestTab === "received" ? "active" : ""
                  }`}
                  onClick={() => setRequestTab("received")}
                >
                  받은 요청
                </button>
                <button
                  className={`sub-tab ${requestTab === "sent" ? "active" : ""}`}
                  onClick={() => setRequestTab("sent")}
                >
                  보낸 요청
                </button>
              </div>
              {requestTab === "received" && (
                <ul className="request-list">
                  {friendRequestsReceived.map((request) => (
                    <li key={request.id}>{request.name}</li>
                  ))}
                </ul>
              )}
              {requestTab === "sent" && (
                <ul className="request-list">
                  {friendRequestsSent.map((request) => (
                    <li key={request.id}>{request.name}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === "friends" && (
            <ul className="friend-list">
              {friendList.map((friend) => (
                <li key={friend.id}>{friend.name}</li>
              ))}
            </ul>
          )}
        </main>
        <aside className="sidebar-right">
          <SideBarRight />
        </aside>
      </div>
    </div>
  );
};

export default MyPage;
