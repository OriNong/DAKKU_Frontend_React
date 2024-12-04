import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { removeTokenInfo } from '../../hooks/tokenSlice';
import { removeUserInfo } from '../../hooks/userSlice';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        Swal.fire({
          title: "로그아웃",
          text: "로그아웃 되었습니다.",
          icon: "success",
        }).then(() => {
          dispatch(removeTokenInfo());
          dispatch(removeUserInfo());
          navigate("/");
        });
      } else {
        return;
      }
    });
  };

  return handleLogout();
};

export default Logout;
