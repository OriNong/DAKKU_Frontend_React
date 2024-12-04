import axios from "axios";
import { useEffect, useState } from "react";
import "./DiaryList.css";

const DiaryList = () => {
  const [OftenDiary, setOftenDiary] = useState([]);
  const [randomDiary, setRandomDiary] = useState([]);

  // 공개 다이어리 가져오기
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/diary/public")
      .then((response) => {
        console.log(response.data);
        setOftenDiary(response.data);
      })
      .catch((error) => {
        console.log("Error fetching often Diary: ", error);
      });
  }, []);

  // 랜덤 3명 사용자 추출
  useEffect(() => {
    if (OftenDiary.length > 0) {
      // 배열에서 랜덤으로 3명을 선택하기
      const randomDiary = getRandomDiary(OftenDiary, 3);
      setRandomDiary(randomDiary);
    }
  }, [OftenDiary]);

  // 랜덤으로 n 명을 추출하는 함수
  const getRandomDiary = (diary, num) => {
    let shuffled = [...diary].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num); // 앞에서 num 만큼 반환
  };

  return (
    <div className="DiaryList-container">
      <h3>
        다이어리 <br />
        리스트
      </h3>
      <br />
      <div className="DiaryList">
        <ul>
          {randomDiary.map((diary, index) => (
            <li key={index} className="diary-li">
              <span>{diary.diaryTitle}</span>
              {/* diaryTitle */}
              {/* <span>{diary.diaryContent}</span> */}
              {/* html 콘텐츠 삽입 리액트 메서드: dangerouslySetInnerHTML */}
              <span
                dangerouslySetInnerHTML={{ __html: diary.diaryContent }}
              ></span>

              {/* diaryContent */}
              <span>{diary.weatherIcon}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DiaryList;
