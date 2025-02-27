import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/AuthContext";
import "../../css/ProfileSetting.css"
import instance from "../../instance/instance";

const ProFileSetting = () => {
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
  const [profileImage, setProfileImage] = useState("/img/default-profile.png"); // 기본 프로필 이미지
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const [newImage, setNewImage] = useState(null); // 새로 업로드할 이미지 파일

  // 기존 프로필 이미지를 가져오는 함수
  const fetchProfileImage = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/user-profile/profile-image`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setProfileImage(data.message);
      }
    } catch (error) {
      console.error("프로필 이미지 조회 실패", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfileImage();
    }
  }, [user]); // user가 바뀔 때마다 프로필 이미지 다시 가져오기

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (newImage) {
      const formData = new FormData();
      formData.append("file", newImage);

      // 기존 이미지가 있는지 판단
      instance
        .get("/user-profile/profile-image")
        .then((res) => {
          console.log(res);
          const { data } = res;
          console.log(data);
          if (data.success) {
            return true;
          } else {
            return false;
          }
        })
        .then((res) => {
          console.log(res);
          // 이미지가 있으니까 삭제 먼저
          if (res) {
            instance
              .delete("/user-profile/ProfileImage")
              .then((res) => {
                console.log(res);
                const { data } = res;
                console.log(data);
              })
              .finally(() => {
                return true;
              });
          }
          return true;
        })
        .then((res) => {
          if (res) {
            instance
              .post("/user-profile/ProfileImage", formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((res) => {
                console.log(res);
                const { data } = res;
                if (data) {
                  setIsModalOpen(false);
                  setProfileImage(
                    `${process.env.REACT_APP_HOST}/file/view/${data}`
                  );
                }
              });
          }
        });
    } else {
      alert("변경할 이미지를 선택하세요.");
    }
  };

  const handleImageDelete = async () => {
    instance.delete("/user-profile/ProfileImage").then((res) => {
      console.log(res);
      if (res.data?.success) {
        setProfileImage("/img/default-profile.png");
        setIsModalOpen(false);
      } else {
        alert(res.data?.data || "이미지 삭제 실패");
      }
    });
  };

  return (
    <>
      <div className="profile-container">
        <div className="profile">
          <img src={profileImage} alt="Profile" className="profile-image" />

          {/* 연필 아이콘 */}
          <img
            src="/img/pencil.png"
            alt="Edit"
            className="edit-icon"
            onClick={() => setIsModalOpen(true)} // 연필 아이콘 클릭시 모달 열기
          />
        </div>
      </div>

      {/* 모달 창 */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>프로필 사진 변경</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            <button onClick={handleImageUpload}>프로필 사진 업로드</button>
            <button onClick={handleImageDelete}>프로필 사진 삭제</button>
            <button onClick={() => setIsModalOpen(false)}>취소</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProFileSetting;
