'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function TodoEditForm({ todo }: { todo: Todo }) {
  const router = useRouter();
  const [title, setTitle] = useState(todo.title);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('내용을 입력해 주세요!');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:8000/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, completed: todo.completed }),
      });

      if (!res.ok) throw new Error();
      router.push('/todos');
      router.refresh();
    } catch {
      setErrorMessage('수정 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-slate-800">할 일 수정</h1>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          className="w-full pl-4 pr-4 py-3.5 bg-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#672be0] transition-all text-slate-700 placeholder-slate-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />

        {errorMessage && (
          <p className="text-red-500 text-xs ml-2 font-medium">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-[#672be0] text-white rounded-2xl font-medium hover:bg-[#5421b8] active:scale-95 transition-all disabled:opacity-50"
        >
          {isSubmitting ? '저장 중...' : '저장'}
        </button>
      </form>
    </>
  );
}