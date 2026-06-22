'use server';

import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getTodos() {
  const res = await fetch(`${API_URL}/todos`, { cache: 'no-store' });
  if (!res.ok) throw new Error('할 일 목록을 불러오는데 실패했습니다.');
  return res.json();
}

export async function getTodo(todoId: string) {
  const todos = await getTodos();
  const todo = todos.find((t: { id: number }) => t.id === Number(todoId));
  if (!todo) throw new Error('해당 할 일을 찾을 수 없습니다.');
  return todo;
}

export async function createTodo(title: string) {
  const res = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('할 일 생성에 실패했습니다.');
  revalidatePath('/todos');
  return res.json();
}

export async function updateTodo(id: number, title: string, completed: boolean) {
  const res = await fetch(`${API_URL}/todos`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, title, completed }),
  });
  if (!res.ok) throw new Error('수정에 실패했습니다.');
  revalidatePath('/todos');
  return res.json();
}

export async function deleteTodo(id: number) {
  const res = await fetch(`${API_URL}/todos`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('삭제에 실패했습니다.');
  revalidatePath('/todos');
}