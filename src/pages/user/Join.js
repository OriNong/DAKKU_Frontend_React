import React, { useState } from "react";
import axios from "axios";
import "./Join.css";

const Join = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 이메일 사용여부 체크
  const checkEmailExists = async (email) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/auth/check/email",
        {
          params: { email },
        }
      );
      return response.data.success && response.data.message === "";
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  // 아이디 사용여부 체크
  const checkUsernameExists = async (username) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/auth/check/username",
        {
          params: { username },
        }
      );
      return response.data.success && response.data.message === "";
    } catch (error) {
      console.error("Error checking username:", error);
      return false;
    }
  };

  // 회원가입 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    // 이메일과 아이디 중복 체크
    const emailExists = await checkEmailExists(formData.email);
    const usernameExists = await checkUsernameExists(formData.username);

    if (!emailExists) {
      setErrors((prev) => ({ ...prev, email: "이메일이 이미 사용 중입니다." }));
      return;
    }
    if (!usernameExists) {
      setErrors((prev) => ({
        ...prev,
        username: "아이디가 이미 사용 중입니다.",
      }));
      return;
    }

    // 회원가입 API 호출
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        formData
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error("등록 중 오류:", error);
      setErrors((prev) => ({
        ...prev,
        general: "회원가입 중 오류가 발생했습니다.",
      }));
    }
  };

  return (
    <div className="registration-container">
      <h2>회원가입</h2>
      {message && <p className="success-message">{message}</p>}
      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">아이디</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {errors.general && <span className="error">{errors.general}</span>}

        <button type="submit" className="submit-btn">
          가입하기
        </button>
      </form>
    </div>
  );
};

export default Join;
