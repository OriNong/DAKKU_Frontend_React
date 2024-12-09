import React, { useEffect, useState } from "react";
import "./chatCss/chatList.css";
import instance from "../../instance/instance";
import { Navbar, Button, ChatItem, Avatar } from "react-chat-elements";
import { IoMdChatbubbles } from "react-icons/io";

const ChatListRoom = ({ chatInfo, chatConnect }) => {
  const [tabNum, setTabNum] = useState(0);
  const [fade, setFade] = useState("");
  const [chatList, setChatList] = useState([]);
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    instance.get("/chat/friendList").then((res) => {
      setFriendList(res.data);
    });
  }, [tabNum]);

  useEffect(() => {
    setChatList(chatInfo);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="chatList-chatItem-div">
        {chatList.length > 0 ? (
          chatList.map((item) => {
            return (
              <ChatItem
                key={item.roomId}
                id={item.roomId}
                avatar={process.env.REACT_APP_CHAT_DEFAULT_PROFILE}
                alt={item.userName}
                onClick={() => {
                  chatConnect(item);
                }}
                title={item.friendName}
                subtitle={
                  item.lastMessage?.length > 0 ? (
                    item.lastMessage
                  ) : (
                    <div>&nbsp;</div>
                  )
                }
                date={new Date(item.createDate)}
                unread={0}
              />
            );
          })
        ) : (
          <div className="chatList-FriendList-Empty">
            대화방이 존재하지 않습니다.
          </div>
        )}
      </div>
    );
  };

  const FriendList = () => {
    return (
      <div className="chatList-FriendList-container">
        {friendList.length > 0 ? (
          friendList.map((item) => {
            return (
              <div key={item.friendId}>
                <div className="chatList-FriendList-div">
                  <Avatar
                    className="chatList-FriendList-avatar"
                    src={process.env.REACT_APP_CHAT_DEFAULT_PROFILE}
                    type="circle"
                    size="large"
                  />
                  <div className="chatList-FriendList-NameTag">
                    <div className="chatList-FriendList-NameTag-div">
                      {item.friendName}
                    </div>
                  </div>
                  <button
                    className="chatList-FriendList-ActionButton"
                    onClick={() => {
                      chatConnect(item);
                    }}
                  >
                    <IoMdChatbubbles />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="chatList-FriendList-Empty">
            친구목록이 비어있습니다.
          </div>
        )}
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
                  text="친구목록"
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
        {tabNum === 0 ? <ChatListItem /> : <FriendList />}
      </div>
    </div>
  );
};

export default ChatListRoom;
