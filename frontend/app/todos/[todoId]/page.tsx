import TodoEditForm from './TodoEditForm';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

async function getTodo(todoId: string): Promise<Todo> {
  const res = await fetch('http://localhost:8000/todos', { cache: 'no-store' });
  if (!res.ok) throw new Error('할 일을 불러오는데 실패했습니다.');
  const todos: Todo[] = await res.json();
  const todo = todos.find((t) => t.id === Number(todoId));
  if (!todo) throw new Error('해당 할 일을 찾을 수 없습니다.');
  return todo;
}

export default async function TodoEditPage({
  params,
}: {
  params: { todoId: string };
}) {
  const todo = await getTodo(params.todoId);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-6">
          <TodoEditForm todo={todo} />
        </div>
      </div>
    </div>
  );
}