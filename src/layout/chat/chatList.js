import { useState } from "react";
import "./chatCss/chatList.css";
import { Navbar, Button } from "react-chat-elements";
import { ChatList } from "react-chat-elements";
import { MdOutlineClose } from 'react-icons/md';

const ChatListRoom = () => {
  const [tabNum, setTabNum] = useState(0);
  const [chatList, setChatList] = useState([
    {
      avatar: 'https://avatars.githubusercontent.com/u/80540635?v=4',
      alt: 'kursat_avatar',
      title: 'Kursat',
      subtitle: "Why don't we go to the No Way Home movie this weekend ?",
      date: new Date(),
      unread: 3,
    }
  ]);

  const ChatListItem = () => {
    return (
      <div>
        <ChatList className="chatList-ChatList" dataSource={chatList} />
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
        right={
          <Button
          className='chatList-Navbar-right-button'
          type='transparent'
          color='black'
          icon={
            {
              float: 'left',
              size: 20,
              component: <MdOutlineClose />
            }
          }
          />
        }
      />
      <div>{tabNum === 0 ? ChatListItem() : "div2"}</div>
    </div>
  );
};

// 난 리액트가 너무 싫다..... (걍 프론트앤드가 싫은것 같다.)
export default ChatListRoom;
