'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const handleToggle = async (todo: Todo) => {
    const res = await fetch(`http://localhost:8000/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: todo.title, completed: !todo.completed }),
    });
    if (res.ok) {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === todo.id ? { ...t, completed: !t.completed } : t
        )
      );
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`http://localhost:8000/todos/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
  };

  if (todos.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-slate-400 text-sm">할 일이 없습니다.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
            todo.completed
              ? 'bg-slate-50 border-slate-100 opacity-60'
              : 'bg-white border-slate-200'
          }`}
        >
          <button
            onClick={() => handleToggle(todo)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              todo.completed
                ? 'bg-[#672be0] border-[#672be0]'
                : 'border-slate-300'
            }`}
          >
            {todo.completed && (
              <span className="text-white text-xs font-bold">✓</span>
            )}
          </button>
          <span
            className={`flex-grow text-sm font-medium ${
              todo.completed ? 'line-through text-slate-400' : 'text-slate-700'
            }`}
          >
            {todo.title}
          </span>
          <Link
            href={`/todos/${todo.id}`}
            className="p-2 text-slate-400 hover:text-[#672be0] transition-colors text-sm font-semibold"
          >
            수정
          </Link>
          <button
            onClick={() => handleDelete(todo.id)}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-medium"
          >
            삭제
          </button>
        </li>
      ))}
    </ul>
  );
}