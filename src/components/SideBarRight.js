import React, { useEffect, useState } from "react";
import "../../src/css/DiarySideRight.css";
import { useSelector } from "react-redux";
import { getUserInfo } from "../hooks/userSlice";
import instance from "../instance/instance";
import Swal from "sweetalert2";

const SideBarRight = () => {
  const userInfo = useSelector(getUserInfo);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userProfileImage, setUserProfileImage] = useState(
    `${process.env.REACT_APP_CHAT_DEFAULT_PROFILE}`
  );
  const [friendsList, setFriendsList] = useState([]);

  useEffect(() => {
    setIsLoggedIn(userInfo.id > 0 ? true : false);

    if (userInfo.id > 0) {
      instance
        .get("/social/meProFiles", {
          params: {
            userId: userInfo.id,
          },
        })
        .then((res) => {
          console.log(res);

          if (res.data.IMG_PATH !== "NO IMG") {
            setUserProfileImage(
              `${process.env.REACT_APP_HOST}/file/view/${res.data.IMG_PATH}`
            );
            // setUserProfileImage(res.data.IMG_PATH);
          }
          if (res.data?.friendShipList.length > 0) {
            res.data.friendShipList.map((item) => {
              setFriendsList((prev) => [
                ...prev,
                {
                  friendId: item.friendId,
                  name: item.friendName,
                  profileImage: `${process.env.REACT_APP_CHAT_small_PROFILE}`,
                },
              ]);
            });
            console.log(friendsList);
          }
          setUserName(res.data.NAME);
          setIsLoggedIn(true);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "사용자 에러",
            text: "프로필을 불러올수가 없습니다.",
          });
        });
    }
  }, [userInfo]);

  const navigateToProfile = (id) => {
    // 친구 목록에서 친구를 클릭시 발생하는 이벤트 컴포넌트.
    console.log(id);
  };

  return (
    <div>
      <div className="sidebar-profile">
        {isLoggedIn ? (
          <>
            <img
              className="sidebar-profile-img"
              src={userProfileImage}
              alt="Profile"
            />
            <p className="sidebar-profile-name">{userName}</p>
          </>
        ) : (
          <p className="sidebar-login-message">로그인 후 이용할 수 있습니다.</p>
        )}
      </div>

      {/* <div className="sidebar-auth">
        {isLoggedIn ? (
          <></>
        ) : (
          <button
            className="sidebar-button"
            onClick={() => {
              navigate("/user/login");
            }}
          >
            로그인
          </button>
        )}
      </div> */}

      <div className="sidebar-friends">
        {isLoggedIn ? (
          friendsList?.length > 0 ? (
            friendsList.map((friend) => (
              <div
                key={friend.friendId}
                className="sidebar-friend-item"
                onClick={(e) => navigateToProfile(friend)}
              >
                <img
                  src={friend.profileImage}
                  alt={friend.name}
                  className="sidebar-friend-img"
                />
                <p className="sidebar-friend-name">{friend.name}</p>
              </div>
            ))
          ) : (
            <p className="sidebar-no-friends">친구가 등록되어있지 않습니다.</p>
          )
        ) : (
          <p className="sidebar-no-friends">친구 목록을 보려면 로그인하세요.</p>
        )}
      </div>
    </div>
  );
};

export default SideBarRight;
