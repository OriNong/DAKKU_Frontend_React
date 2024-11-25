import "./chatCss/chat.css";
import "react-chat-elements/dist/main.css";
import {
  Input,
  MessageList,
  Button,
  Navbar,
  Dropdown,
} from "react-chat-elements";
import { SlActionRedo } from "react-icons/sl";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { MdMenu, MdDelete } from "react-icons/md";
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
  ]);
  const [isChatOpen, setChatOpen] = useState(false);
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
    <div className={`${isChatOpen ? "chatWrapper active" : "chatWrapper"}`}>
      <div className="chat-open-button-div">
        <Button
          className="chat-open-button"
          backgroundColor="transparent"
          color="rgba(0, 0, 0, 0.5)"
          onClick={() => {
            setChatOpen(!isChatOpen);
          }}
          icon={{
            float: "left",
            size: 20,
            component: isChatOpen ? <FaChevronDown /> : <FaChevronUp />,
          }}
        />
      </div>
      <div className="chat-container">
        <Navbar
          className="chat-header"
          left={
            <Button
              type="transparent"
              color="rgba(0, 0, 0, 1)"
              icon={{
                float: "left",
                size: 20,
                component: <IoMdArrowRoundBack />,
              }}
            />
          }
          center={
            <a className="chat-header-center" href="/">
              <p className="chat-header-center-title">Kursat</p>
            </a>
          }
          right={
            <Dropdown
              animationType="default"
              animationPosition="norteast"
              buttonProps={{
                backgroundColor: "transparent",
                text: <MdMenu style={{ fontSize: "25px" }} />,
                color: "black",
              }}
              items={[
                {
                  text: "test1",
                  icon: {
                    float: "right",
                    size: 15,
                    color: "black",
                    component: <MdDelete />,
                  },
                },
              ]}
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
            clear={(clear) => (inputClear = clear)}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage(e.target.value);
              }
            }}
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
    </div>
  );
};

export default Chat;
