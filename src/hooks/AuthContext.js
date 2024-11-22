import React, { createContext, useState, useContext, useEffect } from "react";

// 로그인한 사용자 정보를 관리할 Context 생성
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 사용자 정보 상태

  // 페이지 로드 시 로컬 스토리지에서 로그인된 사용자 정보 가져오기
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // 로컬 스토리지에 저장된 사용자 정보를 상태로 설정
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData)); // 로그인 시 사용자 정보 로컬 스토리지에 저장
    setUser(userData); // 상태에 사용자 정보 설정
  };

  const logout = () => {
    localStorage.removeItem("user"); // 로컬 스토리지에서 사용자 정보 제거
    setUser(null); // 상태에서 사용자 정보 초기화
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 사용자 정보를 사용하는 커스텀 훅
export const useAuth = () => useContext(AuthContext);
