import "./chatCss/chatList.css"
import { Navbar, Button } from 'react-chat-elements';

const ChatList = () => {
  return (
    <div className='chatList-container'>
      <Navbar
        className='chatList-header'
        left={<Button />}
      />
    </div>
  );
}

// 난 리액트가 너무 싫다..... (걍 프론트앤드가 싫은것 같다.)
export default ChatList;