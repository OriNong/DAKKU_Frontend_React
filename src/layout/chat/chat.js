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
import React, { createRef, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import instance from "../../instance/instance";
import Swal from "sweetalert2";

const Chat = ({
  setChatRoomActive,
  chatItemInfo,
  chatListInfo,
  setChatListInfo,
}) => {
  const userInfo = useSelector(getUserInfo);
  const inputReferance = useRef();
  const messageListRef = createRef();
  const writerID = userInfo.id;
  const [newMessage, setNewMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [roomId, setRoomId] = useState(chatItemInfo.roomId);

  // useEffect(() => {
  //   if (chatItemInfo.roomId !== undefined) {
  //     instance
  //       .get(`/chat/uuid`, {
  //         params: {
  //           friendID: chatItemInfo.friendId,
  //         },
  //       })
  //       .then((res) => {
  //         console.log(chatItemInfo);
  //         console.log(res.data);

  //         setRoomId(res.data.roomId);
  //         if (res.data?.list) {
  //           const messageList = res.data.list.map((msg) => ({
  //             position: msg.userID === writerID ? "right" : "left",
  //             type: "text",
  //             title:
  //               msg.userID === writerID
  //                 ? chatItemInfo.userName
  //                 : chatItemInfo.friendName,
  //             text: msg.message,
  //             date: new Date(msg.inputDate),
  //           }));
  //           setChatList(messageList);
  //         } else {
  //           setChatList([]);
  //         }
  //       })
  //       .catch((error) => {
  //         Swal.fire({
  //           title: "채팅 오류",
  //           text: error,
  //           icon: "error",
  //         });
  //       });
  //   }

  //   const client = new Client({
  //     brokerURL: `${process.env.REACT_APP_CHAT_CONNECT}/chat`,
  //     reconnectDelay: 5000,
  //     onConnect: () => {
  //       console.log(roomId);
  //       client.subscribe(`/topic/public/rooms/${roomId}`, (message) => {
  //         const data = JSON.parse(message.body);
  //         console.log(data);
  //         setChatList((prevMessage) => [
  //           ...prevMessage,
  //           {
  //             position: userInfo.id === data.body.userID ? "right" : "left",
  //             type: "text",
  //             title: data.body.userName,
  //             text: data.body.text,
  //             date: new Date(),
  //           },
  //         ]);
  //       });
  //     },
  //   });
  //   client.activate();
  //   setStompClient(client);

  //   return () => {
  //     client.deactivate();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [setChatRoomActive]);

  useEffect(() => {
    if (chatItemInfo.roomId !== undefined) {
      instance
        .get(`/chat/uuid`, {
          params: {
            friendID: chatItemInfo.friendId,
          },
        })
        .then((res) => {
          setRoomId(res.data.roomId);
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
            text: error.message || "에러 발생",
            icon: "error",
          });
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatItemInfo.roomId, chatItemInfo.friendId, writerID]);

  useEffect(() => {
    if (!roomId) return;

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
  }, [roomId, userInfo.id]); // roomId와 userInfo.id가 변경될 때만 실행

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
      setNewMessage("");
      setChatListInfo(
        chatListInfo.map((el) => {
          if (el.roomId === chatItemInfo.roomId) {
            el.lastMessage = newMessage;
          }
          return el;
        })
      );
    }
  };

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
