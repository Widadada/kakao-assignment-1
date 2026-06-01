// DOM 요소 선택
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');
const errorMessage = document.getElementById('error-message');
const filterButtons = document.querySelectorAll('.filter-btn');
const weekDaysContainer = document.getElementById('week-days-container');
const prevWeekBtn = document.getElementById('prev-week-btn');
const nextWeekBtn = document.getElementById('next-week-btn');

// --- 상태 관리 변수 ---
// 로컬스토리지 데이터 로드 (각 Todo는 이제 date 속성을 가집니다: {id, text, isCompleted, date})
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let todoIdCounter = JSON.parse(localStorage.getItem('todoIdCounter')) || 0;

// 필터 및 수정 상태
let currentFilter = 'all';
let editingTodoId = null;

// --- 주간 뷰 관련 상태 변수 ---
const todayStr = formatYYYYMMDD(new Date()); // 오늘 날짜 문자열 고정 ("YYYY-MM-DD")
let selectedDate = todayStr;                // 현재 선택된 날짜 (기본값: 오늘)
let currentWeekStart = getMonday(new Date()); // 현재 화면에 표시 중인 주차의 월요일 Date 객체

/**
 * Date 객체를 "YYYY-MM-DD" 형태의 문자열로 변환하는 함수
 * @param {Date} date 
 * @returns {string} "YYYY-MM-DD"
 */
function formatYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 주어진 날짜가 포함된 주의 월요일 Date 객체를 반환하는 함수
 * @param {Date} date 
 * @returns {Date} 해당 주 월요일의 Date 객체
 */
function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    // 일요일(0)일 때는 전주 월요일이 아니라 이번주 월요일이 되도록 보정 계산
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

/**
 * 데이터를 로컬스토리지에 저장하는 함수
 */
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('todoIdCounter', JSON.stringify(todoIdCounter));
}

/**
 * 주간 뷰(월~일) 캘린더 인터페이스를 그리는 함수
 */
function renderWeek() {
    weekDaysContainer.innerHTML = '';
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];

    // 월요일(currentWeekStart)부터 7일간 반복하며 카드 생성
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(currentWeekStart);
        currentDay.setDate(currentWeekStart.getDate() + i);
        
        const dateStr = formatYYYYMMDD(currentDay);
        const dateNum = currentDay.getDate();

        // 해당 날짜의 총 Todo 개수 계산 (필터링 기준 아님, 순수 데이터 개수)
        const dayTodoCount = todos.filter(todo => todo.date === dateStr).length;

        // 카드 컨테이너 생성
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        
        // 오늘 날짜 및 선택된 날짜 스타일 분기 조건문
        if (dateStr === todayStr) dayCard.classList.add('is-today');
        if (dateStr === selectedDate) dayCard.classList.add('is-selected');

        // 내부 요소 조립 (요일 이름, 날짜 숫자, 할 일 개수 뱃지)
        dayCard.innerHTML = `
            <span class="day-name">${dayNames[i]}</span>
            <span class="day-date">${dateNum}</span>
            <span class="todo-count">${dayTodoCount}</span>
        `;

        // 날짜 선택 클릭 이벤트
        dayCard.onclick = () => {
            if (editingTodoId !== null) {
                alert('현재 수정 중인 항목을 먼저 저장해 주세요.');
                return;
            }
            selectedDate = dateStr;
            renderWeek();  // 날짜 선택 스타일 갱신을 위해 재렌더링
            renderTodos(); // 할 일 목록 업데이트
        };

        weekDaysContainer.appendChild(dayCard);
    }
}

/**
 * 새로운 Todo를 추가하는 함수 (현재 선택된 날짜 정보 포함)
 */
function addTodo() {
    if (editingTodoId !== null) {
        alert('현재 수정 중인 항목을 먼저 저장해 주세요.');
        return;
    }

    const text = todoInput.value.trim();

    if (text === '') {
        errorMessage.classList.remove('hidden');
        todoInput.focus();
        return;
    }

    errorMessage.classList.add('hidden');

    // 새로운 Todo 생성 시 현재 선택된 'date' 정보 바인딩
    const newTodo = {
        id: todoIdCounter++,
        text: text,
        isCompleted: false,
        date: selectedDate 
    };

    todos.push(newTodo);
    
    saveToLocalStorage();
    renderWeek();  // 날짜별 할 일 개수 카운트 갱신을 위해 호출
    renderTodos();
    
    todoInput.value = '';
    todoInput.focus();
}

function deleteTodo(id) {
    if (id === editingTodoId) editingTodoId = null;
    todos = todos.filter(todo => todo.id !== id);
    
    saveToLocalStorage();
    renderWeek();
    renderTodos();
}

function toggleComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, isCompleted: !todo.isCompleted };
        }
        return todo;
    });
    
    saveToLocalStorage();
    renderTodos();
}

function editTodo(id) {
    const todoToEdit = todos.find(todo => todo.id === id);
    if (todoToEdit && todoToEdit.isCompleted) return;

    editingTodoId = id;
    renderTodos();
}

function saveEdit(id, newText) {
    const text = newText.trim();

    if (text !== '') {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, text: text };
            }
            return todo;
        });
        editingTodoId = null;
        
        saveToLocalStorage();
        renderTodos();
    } else {
        alert('할 일을 입력해 주세요.');
    }
}

function cancelEdit() {
    editingTodoId = null;
    renderTodos();
}

function changeFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach(button => {
        if (button.dataset.filter === filter) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    renderTodos();
}

/**
 * 상태 데이터를 기반으로 화면에 Todo 리스트를 그리는 함수
 */
function renderTodos() {
    todoList.innerHTML = '';

    // 1차 필터링: 현재 캘린더에서 '선택된 날짜(selectedDate)'와 일치하는 데이터만 추출
    let filteredTodos = todos.filter(todo => todo.date === selectedDate);

    // 2차 필터링: 하단 탭 상태('전체', '진행 중', '완료')에 맞춤 처리
    filteredTodos = filteredTodos.filter(todo => {
        if (currentFilter === 'active') return !todo.isCompleted;
        if (currentFilter === 'completed') return todo.isCompleted;
        return true;
    });

    // 화면 그리기 로직 (기본 구성 유지)
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.isCompleted ? 'completed' : ''}`;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'action-buttons';

        if (todo.id === editingTodoId) {
            li.classList.add('editing');

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'edit-input';
            input.value = todo.text;

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') saveEdit(todo.id, input.value);
                if (e.key === 'Escape') cancelEdit();
            });

            const saveBtn = document.createElement('button');
            saveBtn.className = 'btn btn-save';
            saveBtn.textContent = '저장';
            saveBtn.onclick = () => saveEdit(todo.id, input.value);

            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'btn btn-cancel';
            cancelBtn.textContent = '취소';
            cancelBtn.onclick = () => cancelEdit();

            li.appendChild(input);
            buttonContainer.appendChild(saveBtn);
            buttonContainer.appendChild(cancelBtn);

            setTimeout(() => input.focus(), 0);

        } else {
            const textSpan = document.createElement('span');
            textSpan.className = 'todo-text';
            textSpan.textContent = todo.text;

            const completeBtn = document.createElement('button');
            completeBtn.className = 'btn btn-complete';
            completeBtn.textContent = todo.isCompleted ? '취소' : '완료';
            completeBtn.onclick = () => toggleComplete(todo.id);

            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-edit';
            editBtn.textContent = '수정';
            editBtn.onclick = () => editTodo(todo.id);
            if (todo.isCompleted) editBtn.disabled = true;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-delete';
            deleteBtn.textContent = '삭제';
            deleteBtn.onclick = () => deleteTodo(todo.id);

            li.appendChild(textSpan);
            buttonContainer.appendChild(completeBtn);
            buttonContainer.appendChild(editBtn);
            buttonContainer.appendChild(deleteBtn);
        }

        li.appendChild(buttonContainer);
        todoList.appendChild(li);
    });
}

// --- 이벤트 리스너 등록 ---
addButton.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTodo();
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => changeFilter(button.dataset.filter));
});

// 주차 이동 버튼 이벤트 핸들러
prevWeekBtn.addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7); // 7일 전으로 이동
    renderWeek();
});

nextWeekBtn.addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7); // 7일 후로 이동
    renderWeek();
});

// --- 초기 앱 구동 ---
renderWeek();
renderTodos();