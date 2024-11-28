import React, { useEffect, useState } from "react";
import instance from "../../instance/instance";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../hooks/userSlice";
import "./Friends.css";

const Friends = () => {
  const [friendships, setFriendships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userInfo = useSelector(getUserInfo);

  // api 요청을 보내 친구 목록을 불러오는 함수
  const fetchFriendshipList = async () => {
    try {
      console.log(userInfo);
      const response = await instance.get(`/social/${userInfo.id}`);
      setFriendships(response.data);
      console.log(response.date);
      setLoading(false); // 로딩 상태 종료
    } catch (err) {
      setError("친구 목록을 불러오는 데 실패했습니다.");
      setLoading(false); // 로딩 상태 종료
    }
  };

  // 컴포넌트가 마운트될 때 api 요청을 보냄
  useEffect(() => {
    fetchFriendshipList();
  }, []); // userId가 변경될 때마다 친구 목록을 다시 불러옴

  // if (loading) {
  //   return <div>Loading...</div>; // 로딩 중일 때
  // }

  // if (error) {
  //   return <div>{error}</div>; // 에러가 발생했을 때
  // }

  return (
    <div className="UserProfile">
      <header className="header">
        <h1>Diary</h1>
      </header>
      <div className="container">
        <aside className="sidebar-left"></aside>
        <main className="main-content">
          <h2></h2>
          <div className="diary-entries">{}</div>
        </main>
        <aside className="sidebar-right">
          <div className="profile"></div>
          <button>Follow</button>
          <button>Chatting</button>
          <div className="Friends">
            <h3>친구 목록</h3>
            <ul>
              <li>
                <img src="/DAKKUimg.jpg" alt="친구 이미지" />
                <p>친구 1</p>
              </li>
              <li>
                <img src="/DAKKUimg.jpg" alt="친구 이미지" />
                친구 2
              </li>
              <li>
                <img src="/DAKKUimg.jpg" alt="친구 이미지" />
                친구 3
              </li>
              <li>
                <img src="/DAKKUimg.jpg" alt="친구 이미지" />
                친구 4
              </li>
              <li>
                <img src="/DAKKUimg.jpg" alt="친구 이미지" />
                친구 4
              </li>
              <li>
                <img src="/DAKKUimg.jpg" alt="친구 이미지" />
                친구 4
              </li>
              <li>
                <img src="/DAKKUimg.jpg" alt="친구 이미지" />
                친구 4
              </li>
              <li>
                <img src="/DAKKUimg.jpg" alt="친구 이미지" />
                친구 4
              </li>
              <li>
                <img src="/DAKKUimg.jpg" alt="친구 이미지" />
                친구 4
              </li>
              <li>
                <img src="/DAKKUimg.jpg" alt="친구 이미지" />
                친구 4
              </li>

              <li>
                <img src="/DAKKUimg.jpg" alt="친구 이미지" />
                친구 4
              </li>
              <li>
                <img src="/DAKKUimg.jpg" alt="친구 이미지" />
                친구 4
              </li>
              <li>
                <img src="/DAKKUimg.jpg" alt="친구 이미지" />
                친구 4
              </li>
              <li>
                <img src="/DAKKUimg.jpg" alt="친구 이미지" />
                친구 4
              </li>
              <li>
                <img src="/DAKKUimg.jpg" alt="친구 이미지" />
                친구 4
              </li>
              <li>
                <img src="/DAKKUimg.jpg" alt="친구 이미지" />
                친구 4
              </li>
              <li>
                <img src="/DAKKUimg.jpg" alt="친구 이미지" />
                친구 4
              </li>
            </ul>

            {/* {friendships.length === 0 ? (
              <p>친구가 없습니다.</p> // 친구 목록이 비어 있을 때
            ) : (
              <ul>
                {friendships.map(
                  (friend) => (
                    <li key={friend}>{friend}</li>
                  ) // 친구 이름을 리스트로 표시
                )}
              </ul>
            )} */}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Friends;
