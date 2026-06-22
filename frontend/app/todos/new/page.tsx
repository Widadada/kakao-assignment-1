'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTodoPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('내용을 입력해 주세요!');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:8000/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) throw new Error();
      router.push('/todos');
      router.refresh();
    } catch {
      setErrorMessage('할 일 생성 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.back()}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              ←
            </button>
            <h1 className="text-xl font-bold text-slate-800">새 할 일 추가</h1>
          </div>

          <form onSubmit={handleSubmit} className="relative mb-2">
            <input
              type="text"
              className="w-full pl-4 pr-16 py-3.5 bg-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#672be0] transition-all text-slate-700 placeholder-slate-400"
              placeholder="새로운 할 일 추가..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="absolute right-2 top-2 bottom-2 px-4 bg-[#672be0] text-white rounded-xl font-medium hover:bg-[#5421b8] active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? '추가 중...' : '추가'}
            </button>
          </form>

          {errorMessage && (
            <p className="text-red-500 text-xs mt-2 ml-2 font-medium">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}