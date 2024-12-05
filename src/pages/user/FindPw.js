import React, { useState } from "react";
import axios from "axios";
import "./FindPw.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const FindPw = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email) {
      setErrorMessage("* 아이디와 이메일을 모두 입력해주세요.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/changePW",
        { username, email }
      );
      const { result, message } = response.data;

      if (result) {
        try {
          // 메시지를 안전하게 처리
          const tempPassword = message
            .split("임시 비밀번호는 ")[1]
            ?.split("입니다.")[0];

          if (tempPassword) {
            Swal.fire({
              icon: "success",
              title: "임시 비밀번호 발급 완료",
              html: `임시 비밀번호는 <span style="color: red">${tempPassword}</span>입니다. 반드시 복사해주세요.`,
              confirmButtonText: "확인",
            }).then(() => {
              Swal.fire({
                icon: "info",
                title: "로그인 후 비밀번호 변경",
                text: "임시 비밀번호로 로그인 후 비밀번호를 변경해주세요.",
                confirmButtonText: "확인",
              }).then(() => {
                navigate("/user/login");
                // window.location.href = "/user/login";
              });
            });
          } else {
            // 메시지 포맷에 문제가 있을 경우
            throw new Error("비밀번호 추출 실패");
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "오류",
            text: "임시 비밀번호 추출 중 오류가 발생했습니다.",
            confirmButtonText: "확인",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "오류",
          text: message,
          confirmButtonText: "확인",
        });
      }
    } catch (error) {
      console.error("Error during password reset: ", error);
      Swal.fire({
        icon: "error",
        title: "서버 오류",
        text: "서버 오류가 발생했습니다. 다시 시도해주세요.",
        confirmButtonText: "확인",
      });
    }

    // alert(message);

    //   if (result) {
    //     alert("임시 비밀번호로 로그인 후 비밀번호를 변경해주세요.");
    //     window.location.href = "/user/login";
    //   } else {
    //     setErrorMessage("* 아이디와 이메일을 다시 확인해주세요.");
    //   }
    // } catch (error) {
    //   console.error("Error during password reset:", error);
    //   setErrorMessage("* 서버 오류가 발생했습니다. 다시 시도해주세요.");
    // } finally {
    //   setIsLoading(false);
  };

  return (
    <form className="findPwForm" onSubmit={handleSubmit}>
      {/* 로고 이미지 */}
      <div className="logo-container">
        <img src="/DAKKUimg.jpg" alt="findPw-logo" className="findPw-logo" />
      </div>
      <h2>비밀번호 찾기</h2>
      {/* <label htmlFor="username">아이디</label> */}
      <input
        type="text"
        name="username"
        id="username"
        placeholder="아이디를 입력하세요."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      {/* <label htmlFor="email">이메일</label> */}
      <input
        type="email"
        name="email"
        id="email"
        placeholder="등록한 이메일을 입력하세요."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {errorMessage && <div className="checkAccount">{errorMessage}</div>}

      <button
        id="findPW"
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "임시 비밀번호 발급 중..." : "임시 비밀번호 받기"}
      </button>

      <Link to="/user/login" id="login">
        로그인
      </Link>
    </form>
  );
};

export default FindPw;
