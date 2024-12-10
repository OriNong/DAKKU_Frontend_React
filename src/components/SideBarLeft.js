import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserInfo, removeUserInfo } from "../hooks/userSlice";
import Swal from "sweetalert2";
import { removeTokenInfo } from "../hooks/tokenSlice";
import "../../src/css/DiarySideLeft.css";
import { removeAlarmInfo } from '../hooks/alarmSlice';

const SideBarLeft = () => {
  const userInfo = useSelector(getUserInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 현재 경로가 active 상태인지 확인
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");

  const Logout = () => {
    Swal.fire({
      title: "로그아웃",
      text: "로그아웃 하시겠습니까?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "네",
      cancelButtonText: "아니요",
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire({
          title: "로그아웃",
          text: "로그아웃 되었습니다.",
          icon: "success",
        }).then(() => {
          dispatch(removeTokenInfo());
          dispatch(removeUserInfo());
          dispatch(removeAlarmInfo());
          navigate("/");
        });
      } else {
        return;
      }
    });
  };

  return (
    <div className="sidebar-content">
      <ul>
        <li className={isActive("/MainPage")}>
          <Link to="/">Main</Link>
        </li>
        <li className={isActive("/chat")}>
          <Link to="/chat">Chat</Link>
        </li>
        <li className={isActive("/MyPage")}>
          <Link to="/MyPage">MyPage</Link>
        </li>
        <li className={isActive("/notice")}>
          <Link to="/notice">Notice</Link>
        </li>
        {userInfo.id > 0 ? (
          <>
            <li className={isActive("/MyDiaryListPage")}>
              <Link to="/diary/myDiary">MyDiary</Link>
            </li>
            <li className={isActive("/setting")}>
              <Link to="/setting">Setting</Link>
            </li>
            <li className={isActive("/Logout")}>
              <Link onClick={() => Logout()}>Logout</Link>
            </li>
          </>
        ) : (
          <>
            <li className={isActive("/login")}>
              <Link to="/user/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default SideBarLeft;
