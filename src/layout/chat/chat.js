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
import { type } from "@testing-library/user-event/dist/type";

const Chat = ({ setChatRoomActive, chatItemInfo }) => {
  const userInfo = useSelector(getUserInfo);
  const inputReferance = React.useRef();
  const messageListRef = React.createRef();
  const roomId = chatItemInfo.roomId;
  const writerID = userInfo.id;
  const [newMessage, setNewMessage] = useState("");
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
    instance
      .get(`/chat/uuid`, {
        params: {
          friendID: chatItemInfo.friendId,
        },
      })
      .then((res) => {
        console.log(res.data.list);
        if (res.data?.list) {
          // friendID: 21
          // message: "asdfasdf"
          // roomID: "a5f5038c-108b-41b5-b293-2718693482c2"
          // userID: 22

          const list = res.data?.list?.map((e) => {
            const obj = {
              position: "",
              type: "text",
              title: "",
              text: "",
              date: new Date(),
            };

            return obj;
          });

          setChatList();

          console.log(list);

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
        console.log(error);
      });

    const client = new Client({
      brokerURL: `${process.env.REACT_APP_CHAT_CONNECT}/chat`,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/public/rooms/${roomId}`, (message) => {
          const data = JSON.parse(message.body);
          console.log(data);
          console.log(messageListRef);
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
  }, [roomId]);

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
