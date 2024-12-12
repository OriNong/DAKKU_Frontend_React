import { useEffect, useRef, useState } from "react";
import Chat from "./chat";
import "./chatCss/chatApp.css";
import ChatListRoom from "./chatList";
import { Button } from "react-chat-elements";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import instance from "../../api/api";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";

const ChatApp2 = () => {
  const userInfo = useSelector(getUserInfo);
  const eventSourceRef = useRef(null);
  const [chatRoomActive, setChatRoomActive] = useState(false);
  const [messageSendChk, setMessageSendChk] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatListInfo, setChatListInfo] = useState([]);
  const [chatItemInfo, setChatItemInfo] = useState({});
  const processedRoomIds = useRef(new Set());

  useEffect(() => {
    instance
      .get("/chat/userRoom")
      .then((res) => {
        setChatListInfo(res.data);
        setUpEvent();
      })
      .catch((error) => {
        console.log(error + "해당 유저의 채팅방 목록을 가져올수 없습니다.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRoomActive, messageSendChk]);

  const setUpEvent = () => {
    eventSourceRef.current = new EventSource(
      `${process.env.REACT_APP_HOST}/message/subscribe`
    );

    eventSourceRef.current.onmessage = (e) => {
      const result = JSON.parse(e.data);
      if (result.userID === userInfo.id) {
        const roomExists = chatListInfo.some(
          (el) => el.roomId === result.roomId
        );

        if (!roomExists && !processedRoomIds.current.has(result.roomId)) {
          setMessageSendChk(Math.random());
          processedRoomIds.current.add(result.roomId);
        }
      }
    };

    eventSourceRef.current.onerror = (e) => {
      console.log("error");
      console.log(e);
      if (
        e.currentTarget instanceof EventSource &&
        e.currentTarget.readState === EventSource.CLOSED
      ) {
        console.log("연결 종료");
        eventSourceRef.current?.close();
      }
    };

    return () => {
      eventSourceRef.current?.close();
    };
  };

  const chatConnect = (item) => {
    setChatItemInfo(item);
    setChatRoomActive(true);
  };

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
