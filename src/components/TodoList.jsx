import React from 'react';
import TodoItem from './TodoItem';

/**
 * TodoList Component: Todo 데이터 배열을 기반으로 목록을 렌더링
 */
const TodoList = ({ todos, onDelete, onToggle, onUpdate }) => {
  if (todos.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-slate-400 text-sm">해당 날짜와 조건에 맞는 할 일이 없습니다.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onToggle={onToggle}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
};

export default TodoList;