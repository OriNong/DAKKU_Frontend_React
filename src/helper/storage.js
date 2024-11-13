//로컬 스토리지에 저장, 불러오기, 삭제하기 만들기
export const setStorageToken = (token) => {
  //token을 string으로 바꾸는 것이 JSON.stringify
  localStorage.setItem("token", JSON.stringify(token));
};
// 토큰 지우기
export const removeStorageToken = () => {
  localStorage.removeItem("token");
};
// 토큰 정보 가져오기
export const getStorageToken = () => {
  //string으로 저장된 문자열이 json으로 변환되어 리턴
  return JSON.parse(localStorage.getItem("token"));
};
