export default function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center space-x-3 transition-all duration-300 border-none outline-none">
      <span className="text-xl">📋</span>
      <span className="text-sm font-semibold tracking-wide">{message}</span>
    </div>
  );
}
