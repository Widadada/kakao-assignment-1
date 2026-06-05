import React, { useState } from 'react';

/**
 * TodoItem Component: 개별 할 일 항목 렌더링 및 수정/완료/삭제 제어
 */
const TodoItem = ({ todo, onDelete, onToggle, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleUpdate = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText);
      setIsEditing(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleUpdate();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <li className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
      todo.isCompleted ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200'
    }`}>
      {/* 완료 상태 토글 체크 버튼 */}
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          todo.isCompleted ? 'bg-[#672be0] border-[#672be0]' : 'border-slate-300'
        }`}
      >
        {todo.isCompleted && (
          <span className="text-white text-xs font-bold">✓</span>
        )}
      </button>

      {/* 할 일 텍스트 영역 */}
      <div className="flex-grow">
        {isEditing ? (
          <input
            type="text"
            className="w-full bg-slate-100 px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-[#672be0] text-sm"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
            autoFocus
          />
        ) : (
          <span className={`text-sm font-medium ${todo.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>
            {todo.text}
          </span>
        )}
      </div>

      {/* 액션 버튼 영역 */}
      <div className="flex gap-1">
        <button
          onClick={handleEditToggle}
          className={`p-2 transition-colors text-sm font-semibold ${
            isEditing ? 'text-[#672be0]' : 'text-slate-400 hover:text-[#672be0]'
          }`}
        >
          {isEditing ? '저장' : '수정'}
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-medium"
        >
          삭제
        </button>
      </div>
    </li>
  );
};

export default TodoItem;