export default function Apearix() {
    return (
        <div className="inline-flex items-center gap-2">
            <svg className="pb-1" width="32" height="32" viewBox="117 128 801 699" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="logoGradient" x1="518" y1="128" x2="518" y2="827"
                        gradientUnits="userSpaceOnUse" >
                        <stop offset="0%" stopColor="#D34CFF" />
                        <stop offset="35%" stopColor="#C13CF7" />
                        <stop offset="70%" stopColor="#8228E8" />
                        <stop offset="100%" stopColor="#4D20D8" />
                    </linearGradient>
                </defs>
                <path d=" M 518 128 L 699 446 L 568 598 L 738 827 L 622 827 L 518 670 L 413 827 L 297 827 L 468 598 L 336 446 Z
                    M 518 317L 587 438L 518 527L 449 438Z"
                    fill="url(#logoGradient)"
                    fillRule="evenodd"
                    clipRule="evenodd"
                />
                <path
                    d=" M 310 492  L 383 572  L 231 827 L 117 827 Z "
                    fill="url(#logoGradient)"
                />
                <path d="  M 725 492  L 918 827  L 803 827  L 652 572  Z" fill="url(#logoGradient)" />
            </svg>
            <span className="text-xl sm:text-2xl md:text-3xl font-medium leading-0  text-heading -ml-0.5">
                Apearix
            </span>
        </div>
    );
}