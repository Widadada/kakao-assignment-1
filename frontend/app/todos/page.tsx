import Link from 'next/link';
import TodoList from './TodoList';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

async function getTodos(): Promise<Todo[]> {
  const res = await fetch('http://localhost:8000/todos', { cache: 'no-store' });
  if (!res.ok) throw new Error('할 일 목록을 불러오는데 실패했습니다.');
  return res.json();
}

export default async function TodosPage() {
  const todos = await getTodos();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-slate-800">할 일 목록</h1>
            <Link
              href="/todos/new"
              className="text-xs font-bold text-[#672be0] bg-[#672be0]/10 px-3 py-1.5 rounded-xl hover:bg-[#672be0]/20 transition-colors"
            >
              + 추가
            </Link>
          </div>
          <TodoList initialTodos={todos} />
        </div>
      </div>
    </div>
  );
}