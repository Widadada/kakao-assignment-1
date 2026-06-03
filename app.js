// DOM 요소 객체 참조
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');
const errorMessage = document.getElementById('error-message');
const filterButtons = document.querySelectorAll('.filter-btn');
const weekDaysContainer = document.getElementById('week-days-container');
const prevWeekBtn = document.getElementById('prev-week-btn');
const nextWeekBtn = document.getElementById('next-week-btn');

// 전역 상태 변수 관리 (로컬스토리지 연동)
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let todoIdCounter = JSON.parse(localStorage.getItem('todoIdCounter')) || 0;

let currentFilter = 'all';
let editingTodoId = null;

// 주간 뷰 관련 상태 변수 설정
const todayStr = formatYYYYMMDD(new Date()); // 오늘 날짜 고정 문자열
let selectedDate = todayStr;                // 기본 선택값: 오늘 날짜
let currentWeekStart = getMonday(new Date()); // 표시 중인 주차의 월요일 Date 객체

// 날짜 포맷 변환 함수 (YYYY-MM-DD)
function formatYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 해당 주차의 월요일 구하는 함수
function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 일요일 예외 처리 포함 계산
    return new Date(d.setDate(diff));
}

// 로컬스토리지 데이터 백업 함수
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('todoIdCounter', JSON.stringify(todoIdCounter));
}

// 주간 뷰(Weekly View) 캘린더 렌더링 함수
function renderWeek() {
    weekDaysContainer.innerHTML = '';
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];

    // 조건: 월요일부터 일요일까지 날짜 카드를 가로로 생성하여 배치
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(currentWeekStart);
        currentDay.setDate(currentWeekStart.getDate() + i);
        
        const dateStr = formatYYYYMMDD(currentDay);
        const dateNum = currentDay.getDate();
        
        // 조건: 각 날짜 아래에 해당 날짜의 총 Todo 개수 실시간 연산
        const dayTodoCount = todos.filter(todo => todo.date === dateStr).length;

        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        
        // 조건: 오늘 날짜 및 선택된 날짜에 대한 시각적 스타일 토글
        if (dateStr === todayStr) dayCard.classList.add('is-today');
        if (dateStr === selectedDate) dayCard.classList.add('is-selected');

        dayCard.innerHTML = `
            <span class="day-name">${dayNames[i]}</span>
            <span class="day-date">${dateNum}</span>
            <span class="todo-count">${dayTodoCount}</span>
        `;

        // 조건: 날짜 클릭 시 해당 날짜의 Todo만 목록에 표시하도록 필터링 트리거
        dayCard.onclick = () => {
            if (editingTodoId !== null) {
                alert('현재 수정 중인 항목을 먼저 저장해 주세요.');
                return;
            }
            selectedDate = dateStr;
            renderWeek();  // 날짜 선택 클래스 반영을 위한 캘린더 갱신
            renderTodos(); // 리스트 목록 필터링 출력
        };

        weekDaysContainer.appendChild(dayCard);
    }
}

// 새로운 Todo 추가 함수
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

    // Todo 생성 시 현재 선택되어 있는 캘린더의 날짜 정보(date)를 매핑
    const newTodo = {
        id: todoIdCounter++,
        text: text,
        isCompleted: false,
        date: selectedDate 
    };

    todos.push(newTodo);
    
    saveToLocalStorage();
    renderWeek();  // 상단 날짜별 Todo 카운트 숫자를 업데이트하기 위해 재호출
    renderTodos();
    
    todoInput.value = '';
    todoInput.focus();
}

// Todo 삭제 함수
function deleteTodo(id) {
    if (id === editingTodoId) editingTodoId = null;
    todos = todos.filter(todo => todo.id !== id);
    
    saveToLocalStorage();
    renderWeek();
    renderTodos();
}

// 완료 토글 함수
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

// 인플레이스 수정 모드 진입 함수
function editTodo(id) {
    const todoToEdit = todos.find(todo => todo.id === id);
    if (todoToEdit && todoToEdit.isCompleted) return;

    editingTodoId = id;
    renderTodos();
}

// 수정 사항 저장 함수
function saveEdit(id, newText) {
    const text = newText.trim();

    if (text !== '') {
        todos = todos.map(todo => {
            if (todo.id === id) return { ...todo, text: text };
            return todo;
        });
        editingTodoId = null;
        
        saveToLocalStorage();
        renderTodos();
    } else {
        alert('할 일을 입력해 주세요.');
    }
}

// 수정 취소 함수
function cancelEdit() {
    editingTodoId = null;
    renderTodos();
}

// 하단 탭 필터 변경 함수
function changeFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach(button => {
        if (button.dataset.filter === filter) button.classList.add('active');
        else button.classList.remove('active');
    });
    renderTodos();
}

// Todo 리스트 뷰 렌더링 함수
function renderTodos() {
    todoList.innerHTML = '';

    // 1차 필터링: 주간 캘린더에서 현재 선택된 날짜(selectedDate) 데이터만 추출
    let filteredTodos = todos.filter(todo => todo.date === selectedDate);
    
    // 2차 필터링: 하단 완료 여부 탭 상태(전체/진행 중/완료)에 따른 분기
    filteredTodos = filteredTodos.filter(todo => {
        if (currentFilter === 'active') return !todo.isCompleted;
        if (currentFilter === 'completed') return todo.isCompleted;
        return true;
    });

    // 필터링 완료된 요소를 화면에 빌드
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.isCompleted ? 'completed' : ''}`;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'action-buttons';

        // 수정 모드 활성화 시 인플레이스 입력창 생성
        if (todo.id === editingTodoId) {
            li.classList.add('editing');

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'edit-input';
            input.value = todo.text;

            // 키보드 엔터(저장) 및 ESC(취소) 이벤트 제어
            input.addEventListener('keydown', (e) => {
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

// 전역 이벤트 리스너 설정
addButton.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTodo();
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => changeFilter(button.dataset.filter));
});

// 조건: 이전 주차, 다음 주차로 넘길 수 있는 버튼 이벤트 리스너 연동
prevWeekBtn.addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7); // 7일 차감
    renderWeek();
});

nextWeekBtn.addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7); // 7일 가산
    renderWeek();
});

// 애플리케이션 초기 구동 실행
renderWeek();
renderTodos();