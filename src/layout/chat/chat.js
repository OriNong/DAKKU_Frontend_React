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
import { MdMenu, MdDelete } from "react-icons/md";
import { Client } from "@stomp/stompjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";

const Chat = ({ setChatRoomActive, chatItemInfo }) => {
  const userInfo = useSelector(getUserInfo);
  const [newMessage, setNewMessage] = useState("");
  const inputReferance = React.useRef();
  const writerID = userInfo.id;
  const [stompClient, setStompClient] = useState(null);
  const [chatList, setChatList] = useState([]);

  // chat 기본 object 구성.
  // {
  //   position: "left",
  //   type: "text",
  //   title: chatItemInfo.friendName,
  //   text: "Give me a message list example !",
  //   date: new Date(),
  // },

  let inputClear = () => {};

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    if (stompClient && newMessage) {
      setChatList((prevChatMessage) => [
        ...prevChatMessage,
        {
          position: "right",
          type: "text",
          title: chatItemInfo.userName,
          text: newMessage,
          date: new Date(),
        },
      ]);
      const chatMessage = {
        roomId: chatItemInfo.roomId,
        text: newMessage,
        userID: writerID,
        friendID: chatItemInfo.friendId,
      };
      stompClient.publish({
        destination: `/app/chat/rooms/${chatItemInfo.roomId}/send`,
        body: JSON.stringify(chatMessage),
      });
    }
    inputClear();
    setNewMessage("");
    console.log(chatList);
  };

  // 방을 만들때 사용자가 친구와 대화하기를 누르고 채팅을 치고나면 그때 방이 자동으로 개설되고 채팅이 저장되게 로직을 구성해야됨.

  useEffect(() => {
    console.log(chatItemInfo.friendId);
    const client = new Client({
      brokerURL: `${process.env.REACT_APP_CHAT_CONNECT}/chat`,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(
          `/topic/public/rooms/${chatItemInfo.roomId}`,
          (message) => {
            const data = JSON.parse(message.body);
            setChatList((prevMessage) => [
              ...prevMessage,
              {
                position: "left",
                type: "text",
                title: data.body.userName,
                text: data.body.text,
                date: new Date(),

                // roomID: data.body.roomId,
                // userID: data.body.userID,
                // friendID: data.body.friendID,
                // message: data.body.text,
              },
            ]);
          }
        );
      },
    });
    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [chatItemInfo.roomId]);

  return (
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
            onClick={() => setChatRoomActive(false)}
          />
        }
        center={
          <a className="chat-header-center" href="/">
            <p className="chat-header-center-title">
              {chatItemInfo.friendName}
            </p>
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
  );
};

export default Chat;
