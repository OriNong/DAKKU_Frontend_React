import "./chatCss/chat.css";
import "react-chat-elements/dist/main.css";
import {
  Input,
  MessageList,
  Button,
  Navbar,
  Avatar,
} from "react-chat-elements";
import { Route } from "react-router-dom";
import { SlActionRedo } from "react-icons/sl";
import { IoMdArrowRoundBack } from 'react-icons/io';
import { MdOutlineClose } from 'react-icons/md';
import React, { useState } from "react";

const Chat = () => {
  const [chatList, setChatList] = useState([
    {
      position: "left",
      type: "text",
      title: "Kursat",
      text: "Give me a message list example !",
      date: new Date(),
    },
    {
      position: "right",
      type: "text",
      title: "Emre",
      text: "That's all.",
      date: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  let inputClear = () => {};
  const inputReferance = React.useRef();

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    setChatList((prevChatList) => [
      ...prevChatList,
      {
        position: "right",
        type: "text",
        title: "Emre",
        text: newMessage,
        date: new Date(),
      },
    ]);

    inputClear();
    setNewMessage("");
  };

  return (
    <div className="chat_container active">
      <Navbar
        className="chat-header"
        left={
          <Button
            type='transparent'
            color='rgba(0, 0, 0, 1)'
            icon={{
              float: 'left',
              size: 20,
              component: <IoMdArrowRoundBack />
            }}
          />
        }
        center={<a className='chat-header-center' href='/'><p className='chat-header-center-title'>Kursat</p></a>}
        right={
          <Button
            type='transparent'
            color='rgba(0, 0, 0, 1)'
            icon={{
              float: 'right',
              size: 25,
              component: <MdOutlineClose />
            }}
          />
        }
      />
      <MessageList
        className="chat-message-list"
        lockable={true}
        toBottomHeight={"100%"}
        dataSource={chatList}
      />
      <div className="chat-message-div-input">
        <Input
          className="chat-message-input"
          placeholder="Type here..."
          referance={inputReferance}
          clear={(clear) => inputClear = clear}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          rightButtons={
            <Button
              title="send"
              icon={{
                float: "left",
                size: 15,
                component: <SlActionRedo />,
              }}
              onClick={sendMessage}
            />
          }
        />
      </div>
    </div>
  );
};

export default Chat;
