import React, { useState } from "react";
import axios from "axios";
import "./Join.css"; // CSS 파일을 임포트합니다.
import EmailVerification from "./email"; // 이메일 인증 컴포넌트
import UsernameChk from "./UsernameChk"; // 아이디 중복 검사 컴포넌트

const Join = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [password2, setPassword2] = useState("");

  const [successMessage, setSuccessMessage] = useState(null);
  const [emailError, setEmailError] = useState(""); // 이메일 중복 에러 메시지

  // 입력값 변경 시 상태 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
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

    if (emailError) {
      return; // 이메일 중복이 있으면 회원가입을 진행하지 않음
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        { email, password, name },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // 성공 시 메시지 표시
      setSuccessMessage("회원가입이 완료되었습니다.");
      // 입력 필드 초기화
      setEmail("");
      setPassword("");
      setName("");
      setPassword2("");
    } catch (err) {
      if (err.response) {
        const errorMessage =
          err.response.data.message || "알 수 없는 오류가 발생했습니다."; // 기본 오류 메시지
        setEmailError(errorMessage);
      } else {
        // 서버와 연결 실패 시 처리
        setEmailError("서버와의 연결이 실패했습니다.");
      }
    }
  };

  return (
    <div className="register-form-container">
      <h2>회원가입</h2>

      <form onSubmit={handleSubmit} className="register-form">
        {/* 아이디 중복 검사 컴포넌트 */}
        <UsernameChk />

        {/* 이메일 인증 컴포넌트 */}
        <EmailVerification
          setEmailError={setEmailError}
          setMessage={setEmailError}
        />

        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password2">비밀번호 확인</label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={password2}
            onChange={handleChange}
            required
            placeholder="비밀번호를 다시 입력하세요"
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleChange}
            required
            placeholder="이름을 입력하세요"
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={emailError} // 이메일 중복되면 비활성화
        >
          회원가입
        </button>

        {/* 성공 메시지 및 에러 메시지 */}
        {(emailError || successMessage) && (
          <div className="form-messages">
            {emailError && <div className="error-message">{emailError}</div>}
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
