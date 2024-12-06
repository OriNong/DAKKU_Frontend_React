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
import instance from "../../instance/instance";
import Swal from "sweetalert2";

const Chat = ({ setChatRoomActive, chatItemInfo }) => {
  const userInfo = useSelector(getUserInfo);
  const inputReferance = React.useRef();
  const messageListRef = React.createRef();
  const roomId = chatItemInfo.roomId;
  const writerID = userInfo.id;
  const [newMessage, setNewMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [chatList, setChatList] = useState([]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    if (stompClient && newMessage) {
      const chatMessage = {
        roomId: roomId,
        text: newMessage,
        userID: writerID,
        friendID: chatItemInfo.friendId,
        userName: chatItemInfo.userName,
        friendName: chatItemInfo.friendName,
      };
      stompClient.publish({
        destination: `/app/chat/rooms/${roomId}/send`,
        body: JSON.stringify(chatMessage),
      });
    }
    setNewMessage("");
  };

  // 방을 만들때 사용자가 친구와 대화하기를 누르고 채팅을 치고나면 그때 방이 자동으로 개설되고 채팅이 저장되게 로직을 구성해야됨.
  useEffect(() => {
    console.log(chatItemInfo);
    if (chatItemInfo.roomId !== undefined) {
      instance
        .get(`/chat/uuid`, {
          params: {
            friendID: chatItemInfo.friendId,
          },
        })
        .then((res) => {
          if (res.data?.list) {
            const messageList = res.data.list.map((msg) => ({
              position: msg.userID === writerID ? "right" : "left",
              type: "text",
              title:
                msg.userID === writerID
                  ? chatItemInfo.userName
                  : chatItemInfo.friendName,
              text: msg.message,
              date: new Date(msg.inputDate),
            }));
            setChatList(messageList);
          } else {
            setChatList([]);
          }
        })
        .catch((error) => {
          Swal.fire({
            title: "채팅 오류",
            text: "데이터베이스에서 채팅 기록을 불러올수 없습니다.",
            icon: "error",
          });
        });
    }

    const client = new Client({
      brokerURL: `${process.env.REACT_APP_CHAT_CONNECT}/chat`,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/public/rooms/${roomId}`, (message) => {
          const data = JSON.parse(message.body);
          setChatList((prevMessage) => [
            ...prevMessage,
            {
              position: userInfo.id === data.body.userID ? "right" : "left",
              type: "text",
              title: data.body.userName,
              text: data.body.text,
              date: new Date(),
            },
          ]);
        });
      },
    });
    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setChatRoomActive]);

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
            onClick={() => {
              setChatRoomActive(false);
            }}
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
        referance={messageListRef}
        toBottomHeight={"100%"}
        dataSource={chatList}
      />
      <div className="chat-message-div-input">
        <Input
          className="chat-message-input"
          placeholder="Type here..."
          referance={inputReferance}
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
