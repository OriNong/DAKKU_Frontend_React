import Swal from "sweetalert2";

import NotificationIcon from "../../components/NotificationIcon";
import HomeIcon from "../../components/HomeIcon";
import NotificationModal from "../../components/NotificationModal";
import useChatAlerts from "../../hooks/useChatAlerts";
import SideBarLeft from "../../components/SideBarLeft";
import SideBarRight from "../../components/SideBarRight";

const MyPage = () => {
    const { chatAlerts, isModalOpen, openModal, closeModal } = useChatAlerts();

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
              
            </main>
            <aside className="sidebar-right">
              <SideBarRight />
            </aside>
          </div>
        </div>
      );
}