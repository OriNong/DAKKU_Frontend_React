import { useEffect, useState } from "react";
import Chat from "./chat";
import "./chatCss/chatApp.css";
import ChatListRoom from "./chatList";
import { Button } from "react-chat-elements";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import instance from "../../api/api";

const ChatApp2 = () => {
  const [chatRoomActive, setChatRoomActive] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatListInfo, setChatListInfo] = useState([]);
  const [chatItemInfo, setChatItemInfo] = useState({});

  const chatConnect = (item) => {
    setChatItemInfo(item);
    setChatRoomActive(true);
  };

  useEffect(() => {
    if (chatListInfo.length === 0) {
      instance
        .get("/chat/userRoom")
        .then((res) => {
          console.log(res.data);
          setChatListInfo(res.data);
        })
        .catch((error) => {
          console.log(error + "해당 유저의 채팅방 목록을 가져올수 없습니다.");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <Chat
            setChatRoomActive={setChatRoomActive}
            chatItemInfo={chatItemInfo}
            chatListInfo={chatListInfo}
            setChatListInfo={setChatListInfo}
          />
        ) : (
          <ChatListRoom chatInfo={chatListInfo} chatConnect={chatConnect} />
        )}
      </div>
    </>
  );
};

const ChatApp = ({ active }) => {
  if (active) {
    return <ChatApp2 />;
  }
};

export default ChatApp;
