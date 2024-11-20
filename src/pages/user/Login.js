import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTokenInfo } from "../../hooks/tokenSlice";
import { setUserInfo } from "../../hooks/userSlice";
import "./Login.css";

const Login = () => {
  // 페이지 이동 함수
  const navigate = useNavigate();
  // 저장소에 저장하는 변수
  const dispatch = useDispatch();

  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
    deviceInfo: {
      deviceId: "2",
      deviceType: "DEVICE_TYPE_WINDOWS",
      notificationToken: "111",
    },
  });

  const onChange = (e) => {
    console.log(e.target.id);
    if (e.target.id === "username") {
      setLoginInfo({
        ...loginInfo,
        username: e.target.value,
      });
    } else if (e.target.id === "password") {
      setLoginInfo({
        ...loginInfo,
        password: e.target.value,
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    axios
      .post(`${process.env.REACT_APP_HOST}/auth/login`, loginInfo)
      .then((res) => {
        console.log(res);
        console.log(loginInfo);
        const { accessToken, refreshToken, tokenType, expiryDuration } =
          res.data;
        console.log(accessToken);
        console.log(refreshToken);
        console.log(tokenType);
        console.log(expiryDuration);
        // 로그인에 성공하면 토큰 정보가 나오는데 해당 정보를 tokenInfoLisce에 저장해서 전역변수에 사용한다.
        dispatch(setTokenInfo(res.data));

        //토큰 정보 넣기 access토큰과 토큰 타입을 같이 날려야 한다.
        axios
          .get(`${process.env.REACT_APP_HOST}/user/me`, {
            headers: {
              Authorization: `${tokenType}${accessToken}`,
            },
          })
          .then((res) => {
            console.log(res);
            //state를 바꿔서 페이지 이동하기, 위에 useNavigate 사용하기
            if (res) {
              dispatch(setUserInfo(res.data));
              navigate("/"); // 메인 페이지로 이동
            }
          })
          .catch((err) => {
            Swal.fire({
              title: "로그인 오류",
              text: "토큰 정보가 올바르지 않습니다.",
              icon: "error",
            });
          });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: "로그인 오류",
          text: "아이디 또는 비밀번호를 확인하세요.",
          icon: "error",
        });
      });
  };
  return (
    <div className="login-wrapper">
      {/* 로고 이미지 */}
      <div className="logo-container">
        <img src="/DAKKUimg.jpg" alt="Logo" className="logo" />
      </div>

      {/* 로그인 폼 제목 */}
      <h2>Login</h2>

      {/* 로그인 폼 */}
      <form onSubmit={onSubmit} id="login-form">
        <input
          type="text"
          name="username"
          id="username"
          placeholder="username"
          value={loginInfo.username}
          onChange={onChange}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={loginInfo.password}
          onChange={onChange}
        />

        {/* 비밀번호 찾기 링크 */}
        <div className="password-recovery">
          <Link to="/user/FindPw">비밀번호 찾기</Link>
        </div>

        <input type="submit" id="btnlogin" value="Login" />
      </form>

      {/* 소셜 로그인 버튼들
      <div className="social-login">
        <p>소셜로 로그인하기</p>
        <div className="social-buttons">
          <button className="google-btn" onClick={googleLogin}>
            <img src="google-logo.png" alt="Google" className="social-logo" />
            <span>구글로 로그인</span>
          </button>
        </div> */}
      <div className="info">
        <p>
          아직 DAKKU 회원이 아니신가요? <Link to="/user/Join">회원가입</Link>
        </p>
      </div>
    </div>
    // </div>
  );
};

export default Login;
