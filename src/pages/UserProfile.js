import React from "react";
import "./css/UserProfile.css";

function UserProfile() {
  return (
    <div className="UserProfile">
      <header className="header">
        <h1>Diary</h1>
      </header>
      <div className="container">
        <aside className="sidebar-left"></aside>
        <main className="main-content">
          <h2></h2>
          <div className="diary-entries">{}</div>
        </main>
        <aside className="sidebar-right">
          <div className="profile"></div>
          <button>Follow</button>
          <button>Chatting</button>
        </aside>
      </div>
    </div>
  );
}

export default UserProfile;
