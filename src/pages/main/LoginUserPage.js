import Calendar from '../../components/CalendarComponent';
import '../../css/LoginUserPage.css';

const LoginUserPage = () => {
    return (
        <div className="app">
          <header className="header">
            <h1>Diary</h1>
          </header>
          <div className="container">
            <aside className="sidebar-left"></aside>
            <main className="main-content">
              <Calendar />
            </main>
            <aside className="sidebar-right">
              <div className="profile"></div>
              <button>Follow</button>
              <button>Chatting</button>
            </aside>
          </div>
        </div>
      );
}

export default LoginUserPage;