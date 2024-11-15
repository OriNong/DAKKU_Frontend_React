import axios from "axios";
import { useState } from "react";

const UsernameChk = () => {
  const [username, setUsername] = useState(""); // 아이디 상태
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
    // 정규 표현식 으로 아이디 유효성 검사
    const idRegExp = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{4,12}$/;

    if (!idRegExp.test(username)) {
      setIdMessage("아이디는 4~12자로 영문과 숫자 조합이어야 합니다.");
      return false; // 유효성 검사 실패
    } else {
      setIdMessage("사용 가능한 아이디입니다.");
      return true; // 유효성 검사 성공
    }
  };

  // 아이디 중복 검사 함수
  const checkUsername = async () => {
    // 아이디가 비어 있으면 유효성 검사 하지 않음
    if (username.trim() === "") {
      setUsernameError(""); // 아이디가 비어 있으면 에러 메시지 초기화
      setIdMessage(""); // 아이디 메시지 초기화
      return;
    }

    // 아이디 유효성 검사
    const isValid = validateUsername(username);
    if (!isValid) {
      setUsernameError(""); // 유효성 검사 실패 시 서버의 중복 검사 메시지 초기화
      return; // 유효하지 않으면 중복 검사 진행 안함
    }

    // 유효한 아이디일 경우 중복 검사 진행
    try {
      const response = await axios.get(
        `http://localhost:8080/api/auth/check/username?username=${username}`
      );
      const { success } = response.data;
      console.log(response.data);

      // 중복 검사 결과 처리
      if (success) {
        setUsernameError(""); // 아이디가 사용 가능하면 에러 메시지 초기화
        setIdMessage("사용 가능한 아이디입니다.");
      } else {
        setUsernameError("이미 사용중인 아이디입니다.");
        setIdMessage(""); // 유효성 메시지 제거
      }
    } catch (error) {
      console.error("아이디 확인 중 오류 발생:", error);
      setUsernameError("아이디 확인에 실패했습니다. 나중에 다시 시도해주세요.");
      setIdMessage(""); // 서버 오류 시 메시지 제거
    }
  };

  return (
    <div>
      <label htmlFor="username">아이디</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={handleUsernameChange} // 입력할 때마다 메시지 초기화
        onBlur={checkUsername} // 입력 후 포커스 아웃 시 중복 체크
      />
      {idMessage && <p>{idMessage}</p>}
      {usernameError && <p style={{ color: "red" }}>{usernameError}</p>}
    </div>
  );
};

export default UsernameChk;
