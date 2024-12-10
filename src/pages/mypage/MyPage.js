import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

import { getUserInfo } from "../../hooks/userSlice";
import HomeIcon from "../../components/HomeIcon";
import SideBarLeft from "../../components/SideBarLeft";
import SideBarRight from "../../components/SideBarRight";

import "../../css/MyPage.css";
import instance from "../../instance/instance";
import { Prev } from "react-bootstrap/esm/PageItem";

const MyPage = () => {
  const userInfo = useSelector(getUserInfo);

  const [friendList, setFriendList] = useState([]);
  const [waitingFriendRequest, setWaitingFriendRequest] = useState([]);

  useEffect(() => {
    instance.get("/social/user/friends/received").then((response) => {
      console.log(response);
      response.data.map((friendRequest) => {
        setWaitingFriendRequest((prevRes) => [
          ...prevRes,
          {
            friendshipId: friendRequest.friendshipId,
            friendName: friendRequest.friendName,
            status: friendRequest.status,
          },
        ]);
      });
    });
    instance
      .get("/social/meProFiles", {
        params: {
          userId: userInfo.id,
        },
      })
      .then((res) => {
        if (res.data?.friendShipList.length > 0) {
          console.log(res.data.friendShipList);
          res.data.friendShipList.map((item) => {
            console.log(item.id);
            setFriendList((prev) => [
              ...prev,
              {
                id: item.id,
                name: item.friendName,
                profileImage: `${process.env.REACT_APP_CHAT_small_PROFILE}`,
              },
            ]);
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userInfo]);

  // 친구 요청 수락 버튼 클릭 시
  const acceptFriendship = (friendshipId) => {
    try {
      instance.post(`social/user/friends/received/accept/${friendshipId}`);
      Swal.fire({
        title: "친구 요청 수락 완료",
        text: "친구 요청이 수락되었습니다",
        icon: "success",
        // 알림창 1.5초 뒤 자동으로 닫힘
        timer: 1500,
        timerProgressBar: true,
        // 알림창 닫혔을 때 페이지 새로 고침
        didClose: () => {
          window.location.reload();
        },
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "친구 요청 수락 처리 실패",
        text: "친구 요청 수락 중 오류 발생",
        timer: 1500,
        timerProgressBar: true,
        didClose: () => {
          window.location.reload();
        },
      });
    }
  };
  // 친구 요청 거절 버튼 클릭 시
  const rejectFriendship = (friendshipId) => {
    try {
      instance.post(`social/user/friends/received/reject/${friendshipId}`);
      Swal.fire({
        title: "친구 요청 거절 완료",
        text: "친구 요청이 거절되었습니다",
        icon: "success",
        // 알림창 1.5초 뒤 자동으로 닫힘
        timer: 1500,
        timerProgressBar: true,
        // 알림창 닫혔을 때 페이지 새로 고침
        didClose: () => {
          window.location.reload();
        },
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "친구 요청 거절 처리 실패",
        text: "친구 요청 거절 중 오류 발생",
        timer: 1500,
        timerProgressBar: true,
        didClose: () => {
          window.location.reload();
        },
      });
    }
  };

  const deleteFriendConfirm = (friendshipId) => {
    Swal.fire({
      title: "정말 삭제하시겠습니까?",
      text: "확인을 누르면 친구 목록에서 삭제됩니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteFriend(friendshipId);
      }
    });
  };
  const handleDeleteFriend = async (friendshipId) => {
    try {
      instance.post(`social/user/friends/received/reject/${friendshipId}`);
      Swal.fire({
        title: "친구 삭제 완료",
        text: "친구 목록에서 삭제가 완료되었습니다.",
        icon: "success",
        // 알림창 1.5초 뒤 자동으로 닫힘
        timer: 1500,
        timerProgressBar: true,
        // 알림창 닫혔을 때 페이지 새로 고침
        didClose: () => {
          window.location.reload();
        },
      });
    } catch (error) {
      Swal.fire({
        title: "삭제 오류",
        text: "일기 삭제 중 오류가 발생했습니다.",
        icon: "error",
        timer: 1500,
        timerProgressBar: true,
        // 알림창 닫혔을 때 페이지 새로 고침
        didClose: () => {
          window.location.reload();
        },
      });
    }
  };

  return (
    <div className="MyDiaryList">
      <header className="header">
        <img src="/img/logo.png" alt="logo" className="logo" />

        <div className="header-icons">
          <HomeIcon />
        </div>
      </header>
      <div className="container">
        <aside className="sidebar-left">
          <SideBarLeft />
        </aside>
        <main className="main-content">
          <h1 className="my-friend-title">나의 친구 관리</h1>
          <div className="myFriend-container">
            <div className="my-friend-requests">
              <h3 className="my-friend-h3">받은 친구 요청 목록</h3>
              {waitingFriendRequest?.length > 0 ? (
                waitingFriendRequest.map((requests) => (
                  <div
                    key={requests.friendshipId}
                    className="friend-request-item"
                  >
                    <p className="request-friend-name">{requests.friendName}</p>
                    <button
                      type="button"
                      className="accept-request-btn"
                      onClick={() => acceptFriendship(requests.friendshipId)}
                    >
                      수락
                    </button>
                    <button
                      type="button"
                      className="reject-request-btn"
                      onClick={() => rejectFriendship(requests.friendshipId)}
                    >
                      거절
                    </button>
                  </div>
                ))
              ) : (
                <p className="friendRequest-not-exist">
                  친구 요청이 존재하지 않습니다.
                </p>
              )}
            </div>
            <div className="my-friend-lists">
              <h3 className="my-friend-h3">친구 목록 관리</h3>
              {friendList?.length > 0 ? (
                friendList.map((friend) => (
                  <div key={friend.id} className="friendlist-item">
                    <img
                      src={friend.profileImage}
                      alt={friend.name}
                      className="friend-item-img"
                    />
                    <p className="fried-item-name">{friend.name}</p>
                    <button
                      type="button"
                      className="friend-delete"
                      onClick={(e) => deleteFriendConfirm(friend.id)}
                    >
                      삭제
                    </button>
                  </div>
                ))
              ) : (
                <p className="friendlist-not-exist">
                  친구가 등록되어 있지 않습니다.
                </p>
              )}
            </div>
          </div>
        </main>
        <aside className="sidebar-right">
          <SideBarRight />
        </aside>
      </div>
    </div>
  );
};

export default MyPage;
