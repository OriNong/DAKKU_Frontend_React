import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import DiaryComponent from "./components/DiaryComponent";
import FindPw from "./pages/user/FindPw";
import Join from "./pages/user/Join";
import Login from "./pages/user/Login";
import ProfileImage from "./pages/mypage/ProfileImage";
// import FileTest from "./pages/file/FileTest";
import { AuthProvider } from "./hooks/AuthContext";
import ChatApp from "./layout/chat/ChatApp";
import { useSelector } from "react-redux";
import { getUserInfo } from "./hooks/userSlice";

function App() {
  const userInfo = useSelector(getUserInfo);
  const [ChatAppActive, setChatAppActive] = useState(false);

  // userInfo에 값의 변화가 있으면 if문을 비교하여 값이 정상적인지 확인후 setChatAppActive에 true아니면 false를 반환 한다.
  useEffect(() => {
    if (
      userInfo.id >= 0 &&
      userInfo.username !== null &&
      userInfo.email !== null &&
      userInfo.roles !== null
    ) {
      setChatAppActive(true);
    } else {
      setChatAppActive(false);
    }
  }, [userInfo]);

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<DiaryComponent />} />
          <Route path="/user/FindPw" element={<FindPw />} />
          <Route path="/user/Join" element={<Join />} />
          <Route path="/user/login" element={<Login />} />
          <Route path="/ProfileImage" element={<ProfileImage />} />
        </Routes>
        <ChatApp active={ChatAppActive} />
      </AuthProvider>
    </>
  );
}
export default App;
