import React, { useState } from "react";
import axios from "axios";
import "./Join.css"; // CSS 파일을 임포트합니다.
import EmailVerification from "./email"; // 이메일 인증 컴포넌트
import UsernameChk from "./UsernameChk"; // 아이디 중복 검사 컴포넌트

const Join = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [name, setName] = useState("");

  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(""); // 전체 에러 메시지
  const [emailError, setEmailError] = useState(""); // 이메일 오류 메시지 상태
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 오류 메시지 상태
  const [nameError, setNameError] = useState(""); // 이름 오류 메시지 상태
  const [passwordConfirmError, setPasswordConfirmError] = useState(""); // 비밀번호 확인 오류 메시지 상태

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/;
    return regex.test(password);
  };

  // 이름 유효성 검사 함수
  const validateName = (name) => {
    const regex = /^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]{2,10}$/; // 최소 2자 이상
    return regex.test(name);
  };

  // 입력값 변경 시 상태 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 비밀번호 유효성 검사 및 비밀번호 확인 일치 여부 검사
    if (name === "password" || name === "password2") {
      // 비밀번호 유효성 검사
      if (name === "password") {
        setPassword(value);
        if (value && !validatePassword(value)) {
          setPasswordError(
            "비밀번호는 8~25자, 숫자와 문자 모두 포함되어야 합니다."
          );
        } else {
          setPasswordError(""); // 비밀번호가 유효하면 오류 메시지 제거
        }

        // 비밀번호 확인 검사도 비밀번호 유효성 검사 후 다시 처리
        if (password2 && value !== password2) {
          setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
        } else {
          setPasswordConfirmError(""); // 비밀번호 확인도 일치하면 오류 메시지 제거
        }
      }

      // 비밀번호 확인 일치 여부 검사
      if (name === "password2") {
        setPassword2(value);
        if (value !== password) {
          setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
        } else {
          setPasswordConfirmError(""); // 일치하면 오류 메시지 제거
        }
      }
    }

    // 이름 유효성 검사
    if (name === "name") {
      setNameError(""); // 이름 오류 메시지 초기화
      setError(""); // 이름 수정 시 전체 에러 메시지도 리셋
      if (!value) {
        setNameError(""); // 이름이 비어 있으면 오류 메시지 초기화
      } else if (!validateName(value)) {
        setNameError("이름은 최소 2자 이상이어야 합니다.");
      }
    }

    // 각 상태 업데이트
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "password2":
        setPassword2(value);
        break;
      case "name":
        setName(value);
        break;
      default:
        break;
    }
  };

  // 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setError(""); // 에러 초기화
    setPasswordError(""); // 비밀번호 오류 초기화
    setNameError(""); // 이름 오류 초기화

    // 이메일 오류가 있을 경우
    if (emailError) {
      setError(emailError);
      return;
    }

    // 서버로 전송할 데이터 로그 찍기
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password); // 비밀번호 확인
    console.log("Name:", name);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        { username, email, password, name },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);

      // 성공 시 메시지 표시
      setSuccessMessage("회원가입이 완료되었습니다.");
      // 입력 필드 초기화
      setUsername("");
      setEmail("");
      setPassword("");
      setPassword2("");
      setName("");
    } catch (err) {
      if (err.response) {
        const errorMessage =
          err.response.data.message || "알 수 없는 오류가 발생했습니다."; // 기본 오류 메시지
        setError(errorMessage);
      } else {
        // 서버와 연결 실패 시 처리
        setError("서버와의 연결이 실패했습니다.");
      }
    }
  };

  return (
    <div className="register-form-container">
      <form onSubmit={handleSubmit} className="register-form">
        {/* 로고 이미지 */}
        <div className="logo-container">
          <img src="/DAKKUimg.jpg" alt="Logo" className="logo" />
        </div>
        <h2>회원가입</h2>
        {/* 아이디 중복 검사 컴포넌트 */}
        <UsernameChk
          setError={setError}
          username={username}
          setUsername={setUsername} // 여기서 setUsername을 전달
        />

        {/* 이메일 인증 컴포넌트 */}
        <EmailVerification
          setMessage={setSuccessMessage}
          setEmailError={setEmailError}
          email={email}
          setEmail={setEmail}
        />

        <div className="form-group">
          {/* <label htmlFor="password">비밀번호</label> */}
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
            placeholder="비밀번호를 입력하세요"
          />
          {/* 비밀번호 유효성 오류 메시지 표시 */}
          {passwordError && (
            <div className="error-message">{passwordError}</div>
          )}
        </div>

        <div className="form-group">
          {/* <label htmlFor="password2">비밀번호 확인</label> */}
          <input
            type="password"
            id="password2"
            name="password2"
            value={password2}
            onChange={handleChange}
            required
            placeholder="비밀번호를 다시 입력하세요"
          />
          {/* 비밀번호 확인 오류 메시지 표시 */}
          {passwordConfirmError && (
            <div className="error-message">{passwordConfirmError}</div>
          )}
        </div>

        <div className="form-group">
          {/* <label htmlFor="name">이름</label> */}
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleChange}
            required
            placeholder="이름을 입력하세요"
          />
          {/* 이름 오류 메시지 표시 */}
          {nameError && <div className="error-message">{nameError}</div>}
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={!!error || !!passwordError || !!nameError} // error, passwordError, nameError가 있을 때 버튼 비활성화
        >
          회원가입
        </button>

        {/* 성공 메시지 및 에러 메시지 */}
        {(error || successMessage) && (
          <div className="form-messages">
            {error && <div className="error-message">{error}</div>}
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default Join;
