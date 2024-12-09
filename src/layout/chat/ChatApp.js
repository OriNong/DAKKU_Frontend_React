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
  const [messageAction, setMessageAction] = useState(0);

  const chatConnect = (item) => {
    setChatItemInfo(item);
    setChatRoomActive(true);
  };

  // 다른 계정으로 로그인시 ChatApp에서 DB를 무한으로 조회하는 버그가 있음.
  useEffect(() => {
    console.log(messageAction);
    if (chatListInfo.length === 0) {
      instance
        .get("/chat/userRoom")
        .then((res) => {
          setChatListInfo(res.data);
        })
        .catch((error) => {
          console.log(error + "해당 유저의 채팅방 목록을 가져올수 없습니다.");
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageAction]);
  // 채팅방을 새로 만들면 다시 로드될수 있도록 추후 구성해야됨.
  // ex. 친구창에서 친구와 대화하기를 누를시 자동으로 방이 자동으로 구성되어야함.

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
            chatMessageAction={setMessageAction}
          />
        ) : (
          <ChatListRoom
            chatInfo={chatListInfo}
            chatConnect={chatConnect}
          />
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
