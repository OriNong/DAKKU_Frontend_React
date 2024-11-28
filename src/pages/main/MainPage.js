import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../css/MainPage.css";

function MainPage() {
  // 현재 경로가 active 상태인지 확인
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");
  return (
    <div className="UserProfile">
      <header className="header">
        <h1>Diary</h1>
        <h2>Main</h2>
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
        <main className="main-content"></main>
        <aside className="sidebar-right">
          <div className="profile">{/* details */}</div>
        </aside>
      </div>
    </div>
  );
}

export default MainPage;
