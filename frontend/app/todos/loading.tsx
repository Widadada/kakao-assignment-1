export default function TodoEditLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-5 h-5 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-6 w-24 bg-slate-200 rounded-xl animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-12 bg-slate-200 rounded-2xl animate-pulse" />
            <div className="h-12 bg-slate-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}