export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        {/* Lightweight SVG with simple Tailwind pulse */}
        <div className="relative w-16 h-16 animate-pulse shadow-[0_0_40px_rgba(109,40,245,0.08)] rounded-full">
          <svg viewBox="117 128 801 699" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="loadingGradient" x1="518" y1="128" x2="518" y2="827" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#D34CFF" />
                <stop offset="35%" stopColor="#C13CF7" />
                <stop offset="70%" stopColor="#8228E8" />
                <stop offset="100%" stopColor="#4D20D8" />
              </linearGradient>
            </defs>
            <path d="M 518 128 L 699 446 L 568 598 L 738 827 L 622 827 L 518 670 L 413 827 L 297 827 L 468 598 L 336 446 Z M 518 317L 587 438L 518 527L 449 438Z" fill="url(#loadingGradient)" fillRule="evenodd" clipRule="evenodd" />
            <path d="M 310 492 L 383 572 L 231 827 L 117 827 Z" fill="url(#loadingGradient)" />
            <path d="M 725 492 L 918 827 L 803 827 L 652 572 Z" fill="url(#loadingGradient)" />
          </svg>
        </div>
        
        {/* Tiny 3-dot indicator */}
        <div className="flex space-x-1.5">
          <div className="w-1.5 h-1.5 bg-[#6D28F5]/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-[#6D28F5]/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-[#6D28F5]/40 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}