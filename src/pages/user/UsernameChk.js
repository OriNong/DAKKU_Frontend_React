import React, { useState } from "react";
import axios from "axios";

const UsernameChk = ({ username, setUsername, setError }) => {
  const [usernameError, setUsernameError] = useState(""); // 오류 메시지 상태
  const [idMessage, setIdMessage] = useState(""); // 아이디 메시지 상태

  // 아이디 입력 변경 핸들러
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameError(""); // 아이디 입력을 변경할 때마다 에러 초기화
    setIdMessage(""); // 아이디 메시지 초기화
  };

  // 아이디 유효성 검사 함수
  const validateUsername = (username) => {
    const idRegExp = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{4,12}$/;

    if (!idRegExp.test(username)) {
      setIdMessage("아이디는 4~12자로 영문과 숫자 조합이어야 합니다....");
      return false;
    } else {
      setIdMessage("사용 가능한 아이디입니다.");
      return true;
    }
  };

  // 아이디 중복 검사 함수
  const checkUsername = async () => {
    if (username.trim() === "") {
      setUsernameError("");
      setIdMessage("");
      return;
    }

    const isValid = validateUsername(username);
    if (!isValid) {
      setUsernameError("");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/auth/check/username?username=${username}`
      );
      const { success } = response.data;
      if (success) {
        setUsernameError(""); // 아이디가 사용 가능하면 에러 메시지 초기화
        setIdMessage("사용 가능한 ID입니다.");
      } else {
        setUsernameError("이미 사용중인 아이디입니다.");
        setIdMessage("");
      }
    } catch (error) {
      console.error("아이디 확인 중 오류 발생:", error);
      setUsernameError("아이디 확인에 실패했습니다. 나중에 다시 시도해주세요.");
      setIdMessage("");
    }
  };

  return (
    <div>
      {/* <label htmlFor="username">아이디</label> */}
      <input
        type="text"
        id="username"
        placeholder="아이디를 입력하세요"
        value={username}
        onChange={handleUsernameChange} // 입력할 때마다 메시지 초기화
        onBlur={checkUsername} // 입력 후 포커스 아웃 시 중복 체크
      />
      {/* 유효성 검사 메시지 */}
      {idMessage && (
        <p
          style={{
            color: idMessage.includes("사용 가능한") ? "green" : "red",
            paddingLeft: "10px",
          }}
        >
          {idMessage}
        </p>
      )}

      {/* 아이디 중복 에러 메시지 */}
      {usernameError && (
        <p style={{ color: "red", paddingLeft: "10px" }}>{usernameError}</p>
      )}
    </div>
  );
};

export default UsernameChk;
