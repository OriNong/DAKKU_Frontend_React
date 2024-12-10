import HomeIcon from "../../components/HomeIcon";
import Setting from "../mypage/Setting";
import SideBarLeft from "../../components/SideBarLeft";

const SettingPage = () => {
  return (
    <div className="UserProfile">
      <header className="header">
        <img src="/img/logo.png" alt="logo" className="logo" />
        <h2>Main</h2>
        <div className="header-icons">
          <HomeIcon />
        </div>
      </header>
      <div className="container">
        <aside className="sidebar-left">
          <SideBarLeft />
        </aside>
        <main className="main-content">
          <Setting />
        </main>
        <aside className="sidebar-right">
          <div className="profile">{/* details */}</div>
        </aside>
      </div>
    </div>
  );
};

export default SettingPage;
