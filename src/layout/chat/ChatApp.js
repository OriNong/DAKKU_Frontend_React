import { useEffect, useState } from "react";
import Chat from "./chat";
import "./chatCss/chatApp.css";
import ChatListRoom from "./chatList";
import { Button } from "react-chat-elements";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import instance from '../../api/api';

const ChatApp = () => {
  const [chatRoomActive, setChatRoomActive] = useState(false);
  const [roomName, setRoomName] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    if (roomId === null) {
      instance.get('/chat/userRoom')
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log("해당 유저의 채팅방 목록을 가져올수 없습니다.")
        })
    }
  }, [])

  return (
    <>
      <div className={`${isChatOpen ? "chatWrapper active" : "chatWrapper"}`}>
        <div className="chat-open-button-div">
          <Button
            className="chat-open-button"
            backgroundColor="transparent"
            color="rgba(0, 0, 0, 0.5)"
            onClick={() => {
              setIsChatOpen(!isChatOpen);
            }}
            icon={{
              float: "left",
              size: 20,
              component: isChatOpen ? <FaChevronDown /> : <FaChevronUp />,
            }}
          />
        </div>
        {chatRoomActive ? (
          <Chat setChatRoomActive={setChatRoomActive} roomName={roomName} />
        ) : (
          <ChatListRoom
            setChatRoomActive={setChatRoomActive}
            setRoomName={setRoomName}
          />
        )}
      </div>
    </>
  );
};

export default ChatApp;
