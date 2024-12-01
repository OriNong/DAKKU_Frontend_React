import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { removeTokenInfo } from "../../hooks/tokenSlice";
import { removeUserInfo } from "../../hooks/userSlice";
import { useState } from "react";
import instance from '../../instance/instance';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const deviceInfo = useState({
    deviceId: "2",
    deviceType: "DEVICE_TYPE_WINDOWS",
    notificationToken: "111",
  });

  // 로그아웃 함수
  const handleLogout = () => {
    instance.post(`/user/logout`, deviceInfo)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      })

    // redux 상태 초기화
    dispatch(removeTokenInfo());
    dispatch(removeUserInfo());

    console.log("로그아웃 완료");
    // 로그아웃 후 이동 페이지
    navigate("/");
  };

  return (
    <div>
      <button onClick={handleLogout}>로그아웃</button>
      {/* 로그아웃 후 리다이렉트할 다른 링크도 가능 */}
      <Link to="/login" onClick={handleLogout}>
        로그아웃
      </Link>
    </div>
  );
};

export default Logout;
