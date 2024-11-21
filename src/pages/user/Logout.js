import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeTokenInfo } from "../../hooks/tokenSlice";
import { removeUserInfo } from "../../hooks/userSlice";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 로그아웃 함수
  const handleLogout = () => {
    dispatch(removeTokenInfo());
    dispatch(removeUserInfo());

    console.log("로그아웃 완료");

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
