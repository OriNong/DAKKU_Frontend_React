import React, { useState } from "react";
import axios from "axios";
import "./FindPw.css";
import { Link } from "react-router-dom";

const FindPw = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

      alert(message);

      if (result) {
        alert("임시 비밀번호로 로그인 후 비밀번호를 변경해주세요.");
        window.location.href = "/user/login";
      } else {
        setErrorMessage("* 아이디와 이메일을 다시 확인해주세요.");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setErrorMessage("* 서버 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="findPwForm" onSubmit={handleSubmit}>
      <h2>비밀번호 찾기</h2>
      <label htmlFor="username">아이디</label>
      <input
        type="text"
        name="username"
        id="username"
        placeholder="아이디를 입력하세요."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <label htmlFor="email">이메일</label>
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

      <button id="findPW" type="submit" disabled={isLoading}>
        {isLoading ? "임시 비밀번호 발급 중..." : "임시 비밀번호 받기"}
      </button>

      <Link to="/user/login" id="login">
        로그인
      </Link>
    </form>
  );
};

export default FindPw;
