interface BoxVisualProps {
  boxSrc: string;
  alt?: string;
  isWobbling?: boolean;
  onClick: () => void;
}

export default function BoxVisual({
  boxSrc,
  alt = 'Shoebox',
  isWobbling = false,
  onClick,
}: BoxVisualProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open ${alt}`}
      className="group relative z-20 cursor-pointer select-none focus:outline-none"
    >
      <style>{`
        @keyframes shoebox-wobble {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          15% { transform: rotate(-6deg) translateY(-3px); }
          30% { transform: rotate(6deg) translateY(0); }
          45% { transform: rotate(-5deg) translateY(-3px); }
          60% { transform: rotate(5deg) translateY(0); }
          75% { transform: rotate(-3deg) translateY(-1px); }
          90% { transform: rotate(3deg) translateY(0); }
        }
        .animate-shoebox-wobble {
          animation: shoebox-wobble 0.55s ease-in-out infinite;
          transform-origin: bottom center;
        }
      `}</style>

      <img
        src={boxSrc}
        alt={alt}
        draggable={false}
        className={`h-56 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03] sm:h-72 md:h-80 ${
          isWobbling ? 'animate-shoebox-wobble' : ''
        }`}
      />
    </button>
  );
}