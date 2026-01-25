export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-slate-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}
