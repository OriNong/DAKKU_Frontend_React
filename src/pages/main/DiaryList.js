import axios from "axios";
import { useEffect, useState } from "react";
import "./DiaryList.css";

const DiaryList = () => {
  const [OftenDiary, setOftenDiary] = useState([]);

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

  return (
    <div className="DiaryList-container">
      <h3>
        다이어리 <br />
        리스트
      </h3>
      <br />
      <div className="DiaryList">
        <ul>
          {OftenDiary.map((diary, index) => (
            <li key={index}>
              <span>{diary.diaryTitle}</span>
              {/* diaryTitle */}
              {/* <span>{diary.diaryContent}</span> */}
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
