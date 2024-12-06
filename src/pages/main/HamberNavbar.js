import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // Link를 import
import "./HanmberNavbar.css";
import SideBarLeft from "../../components/SideBarLeft";

const HanmberNavbar = () => {
  // 사이드바의 열림/닫힘 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 사이드바와 이미지의 ref
  const sidebarRef = useRef(null);
  const toggleRef = useRef(null);

  // 사이드바 열기/닫기 함수
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 사이드바 외부 클릭 시 사이드바 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        !toggleRef.current.contains(e.target)
      ) {
        setIsSidebarOpen(false); // 사이드바를 닫음
      }
    };

    // document에 클릭 이벤트 리스너 추가
    document.addEventListener("mousedown", handleClickOutside);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="Nav">
      <div className="Nav-topbar">
        {/* 이미지 클릭 시 사이드바 열고 닫기 */}

        <img
          ref={toggleRef}
          src="/img/menu-icon.png"
          alt="menu-icon"
          className="Nav-sidebar-toggle"
          onClick={toggleSidebar}
        />
      </div>

      {/* 사이드바 */}
      <div
        ref={sidebarRef}
        className={`Nav-sidebar ${isSidebarOpen ? "open" : ""}`}
      >
        <SideBarLeft />

        {/* <ul>
          <li>
            <Link to="/MainPage">Main</Link>
          </li>
          <li>
            <Link to="/chat">Chat</Link>
          </li>
          <li>
            <Link to="/chat">MyPage</Link>
          </li>
          <li>
            <Link to="/notice">Notice</Link>
          </li>
          <li>
            <Link to="/chat">MyDiary</Link>
          </li>
          <li>
            <Link to="/setting">Setting</Link>
          </li>
          <li>
            <Link to="/chat">Logout</Link>
          </li>
        </ul> */}
      </div>
    </div>
  );
};

export default HanmberNavbar;
