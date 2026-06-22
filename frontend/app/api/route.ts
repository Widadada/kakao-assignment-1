import { NextResponse } from 'next/server';

const FASTAPI_URL = process.env.BACKEND_URL!;

export async function GET() {
  const res = await fetch(`${FASTAPI_URL}/todos`, { cache: 'no-store' });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(`${FASTAPI_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...rest } = body;
  const res = await fetch(`${FASTAPI_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rest),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const res = await fetch(`${FASTAPI_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}