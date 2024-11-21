import "./chatCss/chat.css";
import "react-chat-elements/dist/main.css";
import {
  Input,
  MessageList,
  Button,
  Navbar,
  Avatar,
} from "react-chat-elements";
import { Route, Routes } from "react-router-dom";
import { SlActionRedo } from 'react-icons/sl';

/* 

    {
      position:"left",
      type:"text",
      title:"Kursat",
      text:"Give me a message list example !",
    },
    {
      position:"right",
      type:"text",
      title:"Emre",
      text:"That's all.",
    },

*/

const Chat = () => {
  return (
    <div className="chat_container">
      <Navbar
        className="chat-header"
        left={
          <Avatar
            src="https://avatars.githubusercontent.com/u/15075759?v=4"
            alt="avatar"
            size="xlarge"
            type="circle"
          />
        }
        center={<p>center</p>}
        right={<p></p>}
      />
      <MessageList
        className="chat-message-list"
        lockable={true}
        toBottomHeight={"100%"}
        dataSource={[
          {
            position: "left",
            type: "text",
            title: "Kursat",
            text: "Give me a message list example !",
          },
          {
            position: "right",
            type: "text",
            title: "Emre",
            text: "That's all.",
          },
        ]}
      />
      <div className="chat-message-div-input">
        <Input
          className="chat-message-input"
          placeholder="Type here..."
          rightButtons={<Button title="send" icon={
            {
              float: "left",
              size: 12,
              component: <SlActionRedo/>
            }
          } />}
        />
      </div>
    </div>
  );
};

export default Chat;
