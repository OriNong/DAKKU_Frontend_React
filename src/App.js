import React from "react";
import { Route, Routes } from "react-router-dom";
import DiaryComponent from "./components/DiaryComponent";
import FindPw from "./pages/user/FindPw";
import Join from "./pages/user/Join";
import Login from "./pages/user/Login";
import ProfileImage from "./pages/mypage/ProfileImage";
import Chat from "./layout/chat/chat";
// import FileTest from "./pages/file/FileTest";
import { AuthProvider } from "./hooks/AuthContext";

function App() {
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
        <Chat />
      </AuthProvider>
    </>
  );
}
export default App;
