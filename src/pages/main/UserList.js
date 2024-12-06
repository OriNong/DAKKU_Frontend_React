import axios from "axios";
import { useEffect, useState } from "react";
import "./UserList.css";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [UserProfile, setUserProfiles] = useState([]);
  const [randomUsers, setRandomUsers] = useState([]);
  const navigate = useNavigate(); // 네비게이터 훅

  // 사용자 프로필 데이터를 가여오기
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST}/user/profiles`)
      .then((response) => {
        console.log(response.data);
        setUserProfiles(response.data);
      })
      .catch((error) => {
        console.log("Error fetching user profiles: ", error);
      });
  }, []);

  //   랜덤 5명 사용자 추출
  useEffect(() => {
    if (UserProfile.length > 0) {
      // 배열에서 랜덤으로 6명을 선택하는 로직
      const randomUsers = getRandomUsers(UserProfile, 6);
      setRandomUsers(randomUsers);
    }
  }, [UserProfile]);

  // 랜덤으로 n명을 추출하는 함수
  const getRandomUsers = (users, num) => {
    let shuffled = [...users].sort(() => 0.5 - Math.random());
    // 배열 섞기
    return shuffled.slice(0, num); // 앞에서부터 num만큼 반환
  };

  // 클릭시 사용자 페이지로 이동하는 함수
  const handleProfileClick = (username) => {
    navigate(`/user/${username}`); // 해당 사용자 프로필 경로로 이동
  };

  return (
    <div className="UserList-container">
      <h3>
        사용자 <br />
        리스트
      </h3>
      <br />
      <div className="UserList">
        <ul>
          {randomUsers.map((user, index) => (
            <li key={index} onClick={() => handleProfileClick(user.username)}>
              {user.saveFileName ? (
                <img
                  src={`${process.env.REACT_APP_HOST}/file/view/${user.saveFileName}`}
                  alt={""}
                />
              ) : (
                <img src="/img/default-profile.png" alt={user.username} />
              )}
              <span>{user.username}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserList;
