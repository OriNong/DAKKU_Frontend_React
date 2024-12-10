import { useEffect, useRef, useState } from "react";
import Chat from "./chat";
import "./chatCss/chatApp.css";
import ChatListRoom from "./chatList";
import { Button } from "react-chat-elements";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import instance from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { getAlarmInfo, setAlarmInfo } from "../../hooks/alarmSlice";
import { getStorageUserInfo } from "../../helper/storage";

const ChatApp2 = () => {
  const alarmInfo = useSelector(getAlarmInfo);
  const dispatch = useDispatch();
  const eventSourceRef = useRef(null);
  const [chatRoomActive, setChatRoomActive] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatListInfo, setChatListInfo] = useState([]);
  const [chatItemInfo, setChatItemInfo] = useState({});

  useEffect(() => {
    instance
      .get("/chat/userRoom")
      .then((res) => {
        // res.data?.alarmCount = alarmInfo.alarmCount;
        console.log(alarmInfo);
        res.data?.forEach((element) => {
          alarmInfo.length > 0 ? alarmInfo.forEach((el) => {
            if (el.roomId === element.roomId) {
              element.alarmCount = el.alarmCount;
            }
          }) : (console.log("alarmInfo 배열이 없습니다."));
        });
        setChatListInfo(res.data);
        console.log(res.data);
        setUpEvent();
      })
      .catch((error) => {
        console.log(error + "해당 유저의 채팅방 목록을 가져올수 없습니다.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRoomActive]);

  const setUpEvent = () => {
    const userInfo = getStorageUserInfo();

    eventSourceRef.current = new EventSource(
      `${process.env.REACT_APP_HOST}/message/subscribe`
    );

    eventSourceRef.current.onopen = (e) => {
      console.log("on open");
      console.log(e);
    };

    eventSourceRef.current.onmessage = (e) => {
      const result = JSON.parse(e.data);
      if (result.userID === userInfo?.id) {
        if (alarmInfo.length > 0) {
          const temp = [...alarmInfo];
          dispatch(setAlarmInfo(temp));
        } else {
          let alarmCount;
          alarmInfo.forEach((element) => {
            alarmCount = element.alarmCount;
          });
          const alarmSettings = {
            alarmCount: alarmCount,
            message: result.message,
            friendId: result.userID,
            roomId: result.roomId,
          };
          const temp = [...alarmInfo, alarmSettings];
          dispatch(setAlarmInfo(temp));
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
