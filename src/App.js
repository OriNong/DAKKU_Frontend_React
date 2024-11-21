import React from "react";
import { Route, Routes } from "react-router-dom";
import DiaryComponent from "./components/DiaryComponent";
import FindPw from "./pages/user/FindPw";
import Join from "./pages/user/Join";
import Login from "./pages/user/Login";
<<<<<<< HEAD
import Chat from "./layout/chat/chat";
=======
import Logout from "./pages/user/Logout";
>>>>>>> 001285b29daacfb596d81aa48400d66a32c7168a
// import FileTest from "./pages/file/FileTest";

function App() {
  return (
<<<<<<< HEAD
    <>
      <Routes>
        {/* <Route path="/upload" element={<FileTest />} /> */}
        <Route path="/" element={<DiaryComponent />} />
        <Route path="/user/FindPw" element={<FindPw />} />
        <Route path="/user/Join" element={<Join />} />
        <Route path="/user/login" element={<Login />} />
      </Routes>
      <Chat />
    </>
=======
    <Routes>
      {/* <Route path="/upload" element={<FileTest />} /> */}
      <Route path="/" element={<DiaryComponent />} />
      <Route path="/user/FindPw" element={<FindPw />} />
      <Route path="/user/Join" element={<Join />} />
      <Route path="/user/login" element={<Login />} />
      <Route path="/user/Logout" element={<Logout />} />
    </Routes>
>>>>>>> 001285b29daacfb596d81aa48400d66a32c7168a
  );
}
export default App;
