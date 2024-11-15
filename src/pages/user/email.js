import axios from "axios";
import { useState } from "react";

const EmailVerification = ({ setMessage, setEmailError }) => {
  const [email, setEmail] = useState(""); // 이메일 상태
  const [code, setCode] = useState(""); // 인증 코드 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증 코드 전송 여부
  const [isEmailValid, setIsEmailValid] = useState(true); // 이메일 중복 여부 체크
  const [emailErrorMessage, setEmailErrorMessage] = useState(""); // 이메일 오류 메시지 상태

  // 이메일 입력값 처리
  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    // 이메일이 변경될 때마다 중복 검사
    checkEmailAvailability(inputEmail);
  };

  // 이메일 중복 검사 함수
  const checkEmailAvailability = async (email) => {
    if (!email) {
      setIsEmailValid(true); // 이메일이 비어있으면 유효성 체크 초기화
      setEmailErrorMessage(""); // 메시지 초기화
      setEmailError(""); // 이메일 오류 메시지 초기화
      return;
    }

    try {
      // 이메일 중복 검사 API 호출
      const response = await axios.get(
        `http://localhost:8080/api/auth/check/email?email=${email}`
      );

      if (response.data.success) {
        setIsEmailValid(true); // 이메일이 사용 가능
        setEmailErrorMessage(""); // 중복이 아니면 메시지 초기화
        setEmailError(""); // 이메일 중복 오류 메시지 초기화
        setMessage(""); // 이메일 중복 메시지 초기화
      } else {
        setIsEmailValid(false); // 이메일 중복
        setEmailErrorMessage("이미 사용 중인 이메일입니다."); // 중복된 이메일 메시지
        setEmailError("이미 사용 중인 이메일입니다."); // 중복된 이메일 메시지
        setMessage(""); // 인증번호 전송 메시지 초기화
      }
    } catch (error) {
      console.error("이메일 중복 검사 오류", error);
      setEmailErrorMessage("이메일 중복 검사 중 오류가 발생했습니다.");
      setEmailError("이메일 중복 검사 중 오류가 발생했습니다.");
      setMessage(""); // 인증번호 전송 메시지 초기화
    }
  };

  // 인증 코드 전송 함수
  const sendVerificationCode = async () => {
    if (!email) {
      setMessage("이메일을 입력해주세요.");
      return;
    }

    if (!isEmailValid) {
      setMessage("중복된 이메일입니다. 다른 이메일을 사용해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/mailSend",
        { mail: email }
      );

      if (response.data.success) {
        setMessage("인증번호가 이메일로 전송되었습니다.");
        setIsCodeSent(true);
      } else {
        setMessage("인증번호 전송에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      setMessage("인증번호 전송 중 오류가 발생하였습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 인증 코드 확인 함수
  const verifyCode = async () => {
    if (!code) {
      setMessage("인증 코드를 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/verifyCode",
        { mail: email, code }
      );

      if (response.data.success) {
        setMessage("이메일 인증이 완료되었습니다.");
      } else {
        setMessage("인증번호가 맞지 않습니다.");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setMessage("인증 번호 확인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <label htmlFor="email">이메일</label>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="이메일을 입력하세요"
      />
      {emailErrorMessage && <p style={{ color: "red" }}>{emailErrorMessage}</p>}

      <button
        onClick={sendVerificationCode}
        disabled={isLoading || !isEmailValid} // 이메일 중복이면 비활성화
      >
        {isLoading ? "로딩 중..." : "인증번호 전송"}
      </button>

      {isCodeSent && (
        <div>
          <label htmlFor="code">인증 코드</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="인증 코드를 입력하세요"
          />
          <button onClick={verifyCode} disabled={isLoading}>
            인증 코드 확인
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
