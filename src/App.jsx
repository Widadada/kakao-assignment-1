import React, { useState, useEffect } from 'react';
import TodoInput from './components/TodoInput';
import TodoFilter from './components/TodoFilter';
import TodoList from './components/TodoList';

/**
 * App Component: Todo 앱의 루트 컴포넌트
 * 데이터의 지속성(localStorage)과 날짜별 필터링, 그리고 주간 뷰 상태를 총괄합니다.
 */
function App() {
  // 로컬스토리지 연동 및 초기 데이터 로드
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  
  // 현재 선택된 날짜 상태 관리 (기본값: 오늘 날짜 객체)
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // 현재 필터 상태 관리 ('ALL', 'ACTIVE', 'COMPLETED')
  const [filterStatus, setFilterStatus] = useState('ALL');

  // todos 상태 변화가 감지될 때마다 로컬스토리지에 자동 직렬화 동기화
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  /**
   * formatDate: Date 객체를 'YYYY-MM-DD' 형식의 고유 문자열로 변환합니다.
   */
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  /**
   * getMonday: 특정 날짜가 속한 주차의 '월요일' Date 객체를 구합니다.
   */
  const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    // 일요일(0)이면 6일 전이 월요일, 그 외 요일은 (day - 1)일 전이 월요일
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  /**
   * getWeekDays: 현재 선택된 날짜를 기준으로 월~일요일까지의 7개 Date 객체 배열을 생성합니다.
   */
  const getWeekDays = (baseDate) => {
    const monday = getMonday(baseDate);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const clone = new Date(monday);
      clone.setDate(monday.getDate() + i);
      days.push(clone);
    }
    return days;
  };

  // 주차 이동 함수 (이전 주: -7, 다음 주: +7)
  const handleNavigateWeek = (daysToMove) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + daysToMove);
    setSelectedDate(newDate);
  };

  // 할 일 추가 함수 (Create)
  const handleAddTodo = (taskText) => {
    const newTodo = {
      id: Date.now(),
      text: taskText,
      isCompleted: false,
      date: formatDate(selectedDate),
    };
    setTodos([...todos, newTodo]);
  };

  // 할 일 삭제 함수 (Delete)
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 할 일 상태 토글 함수 (Update - 완료 여부)
  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  // 할 일 내용 수정 함수 (Update - 텍스트 변경)
  const handleUpdateTodo = (id, newText) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  /**
   * getTodoCountForDate: 특정 날짜에 배정된 총 할 일 개수를 반환합니다.
   */
  const getTodoCountForDate = (date) => {
    const dateStr = formatDate(date);
    return todos.filter((todo) => todo.date === dateStr).length;
  };

  /**
   * getFilteredTodos: 현재 선택 날짜 및 탭 필터링 조건에 부합하는 Todo 목록 반환
   */
  const getFilteredTodos = () => {
    const targetDateStr = formatDate(selectedDate);
    const dateMatchedTodos = todos.filter((todo) => todo.date === targetDateStr);
    
    switch (filterStatus) {
      case 'ACTIVE':
        return dateMatchedTodos.filter((todo) => !todo.isCompleted);
      case 'COMPLETED':
        return dateMatchedTodos.filter((todo) => todo.isCompleted);
      case 'ALL':
      default:
        return dateMatchedTodos;
    }
  };

  const weekDays = getWeekDays(selectedDate);
  const todayStr = formatDate(new Date());

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-6">
          
          {/* 상단 헤더 영역 */}
          <header className="mb-6">
            {/* 타이틀 및 Today 버튼 */}
            <div className="flex justify-between items-baseline mb-4">
              <div className="flex items-baseline gap-2">
                <h1 className="text-xl font-bold text-slate-800">
                  {selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                </h1>
                {/* weekday 세팅 'long' 반영 */}
                <span className="text-xl font-bold text-slate-800">
                  {selectedDate.toLocaleDateString('ko-KR', { weekday: 'long' })}
                </span>
              </div>
              {/* 'Today' 텍스트 버튼으로 명칭 변경 */}
              <button
                onClick={() => setSelectedDate(new Date())}
                className="text-xs font-bold text-[#672be0] transition-colors bg-[#672be0]/10 px-3 py-1.5 rounded-xl hover:bg-[#672be0]/20"
              >
                Today
              </button>
            </div>

            {/* 주간 달력 인터페이스 뷰 */}
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              {/* 이전 주차 이동 버튼 */}
              <button
                onClick={() => handleNavigateWeek(-7)}
                className="w-8 h-12 flex items-center justify-center bg-white text-slate-500 hover:text-[#672be0] rounded-xl shadow-sm border border-slate-100 transition-all font-bold text-sm"
              >
                &lt;
              </button>

              {/* 월~일 주간 요일/날짜 매핑 나열 패널 */}
              <div className="flex flex-grow justify-between items-center">
                {weekDays.map((date, idx) => {
                  const dateStr = formatDate(date);
                  const isSelected = formatDate(selectedDate) === dateStr;
                  const isToday = todayStr === dateStr;
                  const todoCount = getTodoCountForDate(date);

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(date)}
                      className={`flex flex-col items-center flex-1 py-1.5 mx-0.5 rounded-xl transition-all ${
                        isSelected 
                          ? 'bg-[#672be0] text-white shadow-md shadow-[#672be0]/20' // 선택된 날짜 스타일
                          : isToday 
                            ? 'bg-slate-200 text-slate-800 font-bold border border-slate-300' // 실제 오늘 날짜 시각 구분 스타일
                            : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      {/* 요일 첫 글자 국문 표기 (월, 화, 수...) */}
                      <span className="text-[10px] font-medium opacity-70">
                        {date.toLocaleDateString('ko-KR', { weekday: 'short' })}
                      </span>
                      {/* 날짜 */}
                      <span className="text-sm font-bold mt-0.5">
                        {date.getDate()}
                      </span>
                      {/* 날짜 밑 할 일 카운팅 뱃지 */}
                      {todoCount > 0 && (
                        <span className={`text-[9px] px-1 rounded-full mt-1 font-bold ${
                          isSelected ? 'bg-white text-[#672be0]' : 'bg-slate-400 text-white'
                        }`}>
                          {todoCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 다음 주차 이동 버튼 */}
              <button
                onClick={() => handleNavigateWeek(7)}
                className="w-8 h-12 flex items-center justify-center bg-white text-slate-500 hover:text-[#672be0] rounded-xl shadow-sm border border-slate-100 transition-all font-bold text-sm"
              >
                &gt;
              </button>
            </div>
          </header>

          {/* 입력창 컴포넌트 */}
          <TodoInput onAdd={handleAddTodo} />

          {/* 상태 필터링 탭 컴포넌트 */}
          <TodoFilter currentFilter={filterStatus} onFilterChange={setFilterStatus} />

          {/* 필터링된 주간/일간 컨텍스트 할 일 리스트 */}
          <TodoList
            todos={getFilteredTodos()}
            onDelete={handleDeleteTodo}
            onToggle={handleToggleTodo}
            onUpdate={handleUpdateTodo}
          />
        </div>
      </div>
    </div>
  );
}

export default App;