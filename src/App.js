import React, { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import DiaryWritePage from "./pages/diary/DiaryWritePage";
import FindPw from "./pages/user/FindPw";
import Join from "./pages/user/Join";
import Login from "./pages/user/Login";
import ProfileImage from "./pages/mypage/ProfileImage";
// import FileTest from "./pages/file/FileTest";
import { AuthProvider } from "./hooks/AuthContext";
import ChatApp from "./layout/chat/ChatApp";
import { useSelector } from "react-redux";
import { getUserInfo } from "./hooks/userSlice";
import MainPage from "./pages/main/MainPage";
import Friends from "./pages/user/Friends";
import UserPage from "./pages/UserPage/UserPage";
import MyDiaryListPage from "./pages/diary/MyDiaryListPage";
import DiaryEdit from "./pages/diary/DiaryEditPage";
import SettingPage from "./pages/diary/DiarySettingPage";
import MyPage from "./pages/mypage/MyPage";
import setUpEvent from './layout/other/SseAlarm';

function App() {
  const userInfo = useSelector(getUserInfo);
  const [isActive, setIsActive] = useState(false);
  const eventSourceRef = useRef(null);

  // userInfo에 값의 변화가 있으면 if문을 비교하여 값이 정상적인지 확인후 setChatAppActive에 true아니면 false를 반환 한다.
  useEffect(() => {
    if (
      userInfo.id > 0 &&
      userInfo.username !== "" &&
      userInfo.email !== "" &&
      userInfo.roles !== ""
    ) {
      setUpEvent(eventSourceRef);
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [userInfo]);

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/user/FindPw" element={<FindPw />} />
          {!isActive && (
            <>
              {/* 만약 로그인후 접근하면 안되는 url은 여기에 추가. */}
              <Route path="/user/Join" element={<Join />} />
              <Route path="/user/login" element={<Login />} />
            </>
          )}
          <Route path="/ProfileImage" element={<ProfileImage />} />
          <Route path="/MainPage" element={<MainPage />} />
          <Route path="/user/Friends" element={<Friends />} />
          <Route path="/diary/myDiary" element={<MyDiaryListPage />} />
          <Route path="/diary/writeDiary" element={<DiaryWritePage />} />
          <Route path="/diary/editDiary" element={<DiaryEdit />} />
          <Route path="/setting" element={<SettingPage />} />
          <Route path="/user/:username" element={<UserPage />} />
          <Route path="/MyPage" element={<MyPage />} />
        </Routes>
        <ChatApp active={isActive} />
      </AuthProvider>
    </>
  );
}
export default App;
