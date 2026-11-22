import { useEffect } from 'react';
import type{ ShoeAsset } from '../../types/shoebox';

interface ShoePreviewModalProps {
  shoe: ShoeAsset | null;
  onClose: () => void;
}

export default function ShoePreviewModal({
  shoe,
  onClose,
}: ShoePreviewModalProps) {
  useEffect(() => {
    if (!shoe) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shoe, onClose]);

  if (!shoe) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={shoe.title}
      onClick={onClose}
      className="fixed inset-0 z-50 flex cursor-default items-center justify-center bg-stone-950/45 p-4 caret-transparent select-none backdrop-blur-xs transition-opacity duration-200"
    >
      <div
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative flex min-h-72 w-full max-w-md cursor-default items-center justify-center rounded-3xl border border-stone-200/80 bg-white p-8 caret-transparent select-none shadow-2xl transition-all duration-200 focus:outline-none sm:min-h-80 sm:p-10"
      >
        {/* Top-Right Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full  text-stone-600 caret-transparent transition-colors hover:bg-stone-200 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            &times;
          </span>
        </button>

        {/* Shoe Image Only */}
        <img
          src={shoe.src}
          alt={shoe.title}
          draggable={false}
          className="max-h-60 w-auto object-contain caret-transparent select-none drop-shadow-md sm:max-h-72"
        />
      </div>
    </div>
  );
}