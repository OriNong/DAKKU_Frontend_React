import React, { useEffect, useState } from "react";
import "./chatCss/chatList.css";
import { Navbar, Button } from "react-chat-elements";
import { ChatList } from "react-chat-elements";

const ChatListRoom = ({ setChatRoomActive, setRoomName }) => {
  const [tabNum, setTabNum] = useState(0);
  const [fade, setFade] = useState("");
  const [chatList, setChatList] = useState([
    {
      avatar: "https://avatars.githubusercontent.com/u/80540635?v=4",
      alt: "kursat_avatar",
      title: "Kursat",
      subtitle: "Why don't we go to the No Way Home movie this weekend ?",
      date: new Date(),
      unread: 3,
    },
  ]);

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
      <div>
        <ChatList
          className="chatList-ChatList"
          onClick={() => {
            setRoomName();
            setChatRoomActive(true);
          }}
          dataSource={chatList}
        />
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
        {tabNum === 0 ? ChatListItem() : "div2"}
      </div>
    </div>
  );
};

export default ChatListRoom;
