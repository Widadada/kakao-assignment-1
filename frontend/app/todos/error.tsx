'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TodoEditError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-6 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">
            오류가 발생했습니다
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            {error.message || '알 수 없는 오류가 발생했습니다.'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={reset}
              className="flex-1 py-2.5 bg-[#672be0] text-white rounded-xl font-medium hover:bg-[#5421b8] active:scale-95 transition-all"
            >
              다시 시도
            </button>
            <button
              onClick={() => router.push('/todos')}
              className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 active:scale-95 transition-all"
            >
              목록으로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}