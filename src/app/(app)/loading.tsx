export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
