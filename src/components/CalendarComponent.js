import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarCheck } from 'lucide-react';
import './Calendar.css'; // Import the CSS file

const Calendar = ({ fetchDiary }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // 현재 월의 첫 날과 마지막 날 계산
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  // 날짜 배열 생성
  const generateCalendarDays = () => {
    const days = [];
    const startDay = firstDayOfMonth.getDay(); // 월의 첫 날 요일
    const totalDays = lastDayOfMonth.getDate(); // 월의 마지막 날

    // 이전 달의 날짜 추가 (회색으로 표시)
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    for (let i = 0; i < startDay; i++) {
      days.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonth.getDate() - startDay + i + 1),
        type: 'prev'
      });
    }

    // 현재 월의 날짜 추가
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
        type: 'current'
      });
    }

    // 다음 달의 날짜 추가 (남은 공간이 있을 경우에만)
    const remainingCells = 35 - days.length; // 5주(35일) 분량 채우기
    if (remainingCells > 0) {
      for (let i = 1; i <= remainingCells; i++) {
        days.push({
          date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i),
          type: 'next'
        });
      }
    }

    return days;
  };

  // 월 변경 핸들러
  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  // 오늘 날짜로 이동 핸들러
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // 날짜 선택 핸들러
  const handleDateClick = async (dateObj) => {
    if (dateObj.type === 'current') {
      const selectedDate = dateObj.date;
      setSelectedDate(selectedDate);

      // 선택된 날짜의 일기 가져오기
      try {
        // fetchDiary는 상위 컴포넌트에서 전달받을 비동기 함수
        // 포맷: YYYY-MM-DD 형식의 날짜 문자열
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const diaryEntry = await fetchDiary(formattedDate);
        
        // diaryEntry를 어떻게 처리할지는 상위 컴포넌트에서 결정
      } catch (error) {
        console.error('일기 불러오기 실패:', error);
      }
    }
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button 
          onClick={() => changeMonth(-1)} 
          className="nav-button"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="current-month">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
        <div className="header-actions">
          <button 
            onClick={goToToday} 
            className="today-button"
            title="오늘 날짜로 이동"
          >
            <CalendarCheck size={18} />
          </button>
          <button 
            onClick={() => changeMonth(1)} 
            className="nav-button"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="weekday-header">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <div 
            key={day} 
            className={`weekday ${index === 0 ? 'sunday' : ''}`}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid">
        {calendarDays.map((dateObj, index) => {
          const date = dateObj.date;
          const isToday = date.toDateString() === today.toDateString();
          const isSelected = date.toDateString() === selectedDate?.toDateString();
          const isCurrentMonth = dateObj.type === 'current';
          const isSunday = date.getDay() === 0;

          return (
            <div 
              key={index} 
              className={`calendar-day 
                ${isCurrentMonth ? 'current-month' : 'other-month'}
                ${isToday ? 'today' : ''}
                ${isSelected ? 'selected' : ''}
                ${isCurrentMonth && isSunday ? 'sunday' : ''}`}
              onClick={() => handleDateClick(dateObj)}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;