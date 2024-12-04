import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getUserInfo,
  removeUserInfo,
  setUserInfo,
} from "../../hooks/userSlice";
import { useDispatch } from "react-redux";
import "../../css/DiarySetting.css";
import instance from "../../instance/instance";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { removeTokenInfo } from "../../hooks/tokenSlice";

const Setting = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [passwordChk, setPasswordChk] = useState("");
  const [password, setPassword] = useState("");
  const userInfo = useSelector(getUserInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    instance
      .get("/social/meProFiles", {
        params: {
          userId: userInfo.id,
        },
      })
      .then((res) => {
        setUserId(res.data.USERNAME);
        setUserEmail(res.data.EMAIL);
        setUserName(res.data.NAME);
      });
  }, [userInfo]);

  const handleSave = (e) => {
    e.preventDefault();

    const pwdReg = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/;

    // 성함 검증
    if (!userName.trim()) {
      Swal.fire({
        title: "Error",
        text: "성함을 작성해주세요.",
        icon: "error",
      });
      return;
    }

    // 비밀번호 검증 (입력된 경우에만 실행)
    if (password.trim()) {
      if (!pwdReg.test(password)) {
        Swal.fire({
          title: "Error",
          text: "비밀번호는 영문 숫자 조합 8자리 이상으로 작성해주세요.",
          icon: "error",
        });
        return;
      }

      if (password !== passwordChk) {
        Swal.fire({
          title: "Error",
          text: "비밀번호가 맞지 않습니다.",
          icon: "error",
        });
        return;
      }
    }

    console.log({
      userName: userName,
      password: password.trim() ? password : "", // 비밀번호 유무에 따라 값 전송
      passwordChk: password.trim() ? passwordChk : "",
      userId: userInfo.id,
    });

    // 공통 API 호출
    instance
      .post("/social/userInfoApply", {
        name: userName,
        password: password.trim() ? password : "", // 비밀번호 유무에 따라 값 전송
        passwordChk: password.trim() ? passwordChk : "",
        userId: userInfo.id,
      })
      .then((res) => {
        console.log(res);
        if (res.data.body.success) {
          Swal.fire({
            title: "수정 완료!",
            text: res.data.body.data,
            icon: "success",
          }).then(() => {
            dispatch(
              setUserInfo({
                ...userInfo,
                name: userName,
              })
            );
            navigate("/");
          });
        }
        if (res.data.body.success === false) {
          Swal.fire({
            title: "백엔드 오류",
            text: res.data.body.data,
            icon: res.data.body.success ? "success" : "error",
          });
        }
      })
      .catch((error) => {
        if (error.data.body.success === false) {
          Swal.fire({
            title: "BackEnd Error",
            text: "서버 에러가 발생했습니다.",
            icon: "error",
          });
        }
      });
  };

  const handleUserDelete = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "회원 탈퇴",
      text: "정말 회원탈퇴를 하실건가요?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "네",
    }).then((result) => {
      if (result.isConfirmed) {
        instance
          .post("/social/userDelete")
          .then((res) => {
            if (res.data.body.success) {
              Swal.fire({
                title: "알림",
                text: "회원 탈퇴가 완료되었습니다.",
                icon: "info",
              }).then(() => {
                dispatch(removeTokenInfo());
                dispatch(removeUserInfo());
                navigate("/");
              });
            }
          })
          .catch((error) => {
            Swal.fire({
              title: "Error",
              text: "알수 없는 오류가 발생하였습니다.",
              icon: "error",
            }).then(() => {
              navigate("/");
            });
          });
      }
    });
  };

  return (
    <form onSubmit={handleSave}>
      {/* 중단: 회원 정보 수정 */}
      <div className="profile-info-section">
        <div className="profile-info-item">
          <label>이메일</label>
          <input type="email" value={userEmail} readOnly />
        </div>
        <div className="profile-info-item">
          <label>아이디</label>
          <input type="text" value={userId} readOnly />
        </div>
        <div className="profile-info-item">
          <label>성함</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="profile-info-item">
          <label>비밀번호</label>
          <input
            type="password"
            placeholder="변경할 비밀번호를 넣어주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="profile-info-item">
          <label>비밀번호 확인</label>
          <input
            type="password"
            placeholder="변경할 비밀번호를 다시한번 입력해주세요."
            value={passwordChk}
            onChange={(e) => setPasswordChk(e.target.value)}
          />
        </div>
        <div className="profile-info-userDelete-div">
          <label>회원 탈퇴</label>
          <button
            className="profile-info-userDelete"
            type="button"
            onClick={handleUserDelete}
          >
            회원탈퇴
          </button>
        </div>
      </div>

      {/* 하단: 회원 탈퇴 */}
      <div className="profile-actions">
        <button className="profile-save-button" type="submit">
          저장
        </button>
        <button
          type="button"
          className="profile-cancel-button"
          onClick={() => navigate("/")}
        >
          취소
        </button>
      </div>
    </form>
  );
};

export default Setting;
