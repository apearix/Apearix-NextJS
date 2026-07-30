export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#F4F0FF] border-t-[#6D28F5] animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest text-[#6D28F5]">
          Apearix Loading...
        </span>
      </div>
    </div>
  );
}
