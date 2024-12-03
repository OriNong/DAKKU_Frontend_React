import React, { useEffect, useState } from "react";
import "../../css/DiarySideRight.css";
import { useSelector, useDispatch } from "react-redux";
import { getUserInfo, removeUserInfo } from "../../hooks/userSlice";
import instance from "../../instance/instance";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { removeTokenInfo } from "../../hooks/tokenSlice";

const SideBarRight = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(getUserInfo);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [userProfileImage, setUserProfileImage] = useState(
    `${process.env.REACT_APP_CHAT_DEFAULT_PROFILE}`
  );
  let count = 0;
  const [friendsList, setFriendsList] = useState([]);

  useEffect(() => {
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
            setUserProfileImage(res.data.IMG_PATH);
          }
          if (res.data?.friendShipList.length > 0) {
            res.data.friendShipList.map((item) => {
              setFriendsList((prev) => [
                ...prev,
                {
                  id: count + 1,
                  name: item.FRIEND_NAME,
                  profileImage: `${process.env.REACT_APP_CHAT_small_PROFILE}`,
                },
              ]);
            });
            console.log(friendsList);
          }
          setUserName(res.data.USERNAME);
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
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "로그아웃",
      text: "로그아웃 하시겠습니까?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "네",
      cancelButtonText: "아니요",
    }).then((res) => {
      if (res.isConfirmed) {
        instance
          .post(`/user/logout`, {
            deviceInfo: {
              deviceId: "2",
              deviceType: "DEVICE_TYPE_WINDOWS",
              notificationToken: "111",
            },
          })
          .then((res) => {
            console.log(res);
            if (res.data.success === true) {
              dispatch(removeTokenInfo());
              dispatch(removeUserInfo());
              setIsLoggedIn(false);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        return;
      }
    });
  };

  const navigateToProfile = (id) => {
    console.log(`Navigating to profile with ID: ${id}`);
    // 페이지 이동 로직 추가
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

      <div className="sidebar-auth">
        {isLoggedIn ? (
          <button className="sidebar-button" onClick={handleLogout}>
            로그아웃
          </button>
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
      </div>

      <div className="sidebar-friends">
        {isLoggedIn ? (
          friendsList?.length > 0 ? (
            friendsList.map((friend) => (
              <div
                key={friend.id}
                className="sidebar-friend-item"
                onClick={(e) => navigateToProfile(e)}
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
