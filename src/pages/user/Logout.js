import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { removeTokenInfo } from "../../hooks/tokenSlice";
import { removeUserInfo } from "../../hooks/userSlice";
import { useState, useEffect } from "react";
import instance from "../../instance/instance";
import { getStorageToken } from "../../helper/storage"; // getStorageToken 추가

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 추적하는 상태

  const deviceInfo = {
    deviceId: "2",
    deviceType: "DEVICE_TYPE_WINDOWS",
    notificationToken: "111",
  };

  // 컴포넌트가 마운트될 때 로그인 상태를 확인
  useEffect(() => {
    const token = getStorageToken();
    if (token && token.accessToken) {
      setIsLoggedIn(true); // 로그인 상태
    } else {
      setIsLoggedIn(false); // 로그아웃 상태
    }
  }, []);

  // 로그아웃 함수
  const handleLogout = () => {
    instance
      .post(`/user/logout`, deviceInfo)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });

    // redux 상태 초기화
    dispatch(removeTokenInfo());
    dispatch(removeUserInfo());

    console.log("로그아웃 완료");
    // 로그아웃 후 이동 페이지
    navigate("/");
  };

  return (
    <div>
      {isLoggedIn ? (
        <Link to="/" onClick={handleLogout}>
          로그아웃
        </Link>
      ) : (
        <Link to="/user/login">로그인</Link>
      )}
    </div>
  );
};

export default Logout;
