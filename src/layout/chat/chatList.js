import React, { useEffect, useState } from "react";
import "./chatCss/chatList.css";
import { Navbar, Button, ChatItem } from "react-chat-elements";

const ChatListRoom = ({ chatInfo, chatConnect }) => {
  const [tabNum, setTabNum] = useState(0);
  const [fade, setFade] = useState("");
  const [chatList, setChatList] = useState([]);

  
  useEffect(() => {
    setChatList(chatInfo);
  }, [chatInfo]);

  useEffect(() => {
    let a = setTimeout(() => {
      setFade("end");
    }, 100);
    return () => {
      clearTimeout(a);
      setFade("");
    };
  }, [tabNum]);

  const ChatListItem = () => {
    return (
      <div className='chatList-chatItem-div'>
        {chatList.length > 0 ? chatList.map((item) => {
          return (
            <ChatItem
              key={item.roomId}
              id={item.roomId}
              avatar={process.env.REACT_APP_CHAT_DEFAULT_PROFILE}
              alt={item.userName}
              onClick={() => chatConnect(item)}
              title={item.friendName}
              subtitle="Ok. See you !"
              date={new Date(item.createDate)}
              unread={0}
            />
          );
        }) : "채팅방이 없습니다."}
      </div>
    );
  };

  return (
    <div className="chatList-container">
      <Navbar
        className="chatList-header"
        center={
          <div className="chatList-Navbar-center">
            <ul className="chatList-Navbar-center-ulTag">
              <li className="chatList-Navbar-center-liTag">
                <Button
                  className="chatList-Navbar-center-liTag-button"
                  type="transparent"
                  color="black"
                  text="채팅방"
                  onClick={() => {
                    setTabNum(0);
                  }}
                />
              </li>
              <li className="chatList-Navbar-center-liTag">
                <Button
                  className="chatList-Navbar-center-liTag-button"
                  type="transparent"
                  color="black"
                  text="목록"
                  onClick={() => {
                    setTabNum(1);
                  }}
                />
              </li>
            </ul>
          </div>
        }
      />
      <div className={`start ${fade}`}>
        {tabNum === 0 ? <ChatListItem /> : "div2"}
      </div>
    </div>
  );
};

export default ChatListRoom;
