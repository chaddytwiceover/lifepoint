import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // Focus first focusable element inside modal
      setTimeout(() => {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable && focusable.length > 0) {
          focusable[0].focus();
        }
      }, 50);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        if (previouslyFocusedElement.current) {
          previouslyFocusedElement.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }[maxWidth];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? 'modal-description' : undefined}
        className={`w-full ${maxWidthClasses} bg-[#fdfbf7] border-2 border-stone-300 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 text-stone-900 max-h-[90vh] overflow-y-auto transform transition-all duration-200 relative`}
        id={`modal-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {/* Top Washi Tape strip across notepad header */}
        <div className="washi-tape-strip h-3 w-28 mx-auto -mt-6 mb-3 rounded-xs opacity-90 hidden sm:block" />

        <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b-2 border-stone-200">
          <div>
            <h2 id="modal-title" className="text-xl sm:text-2xl font-handwriting font-bold tracking-tight text-stone-900">
              {title}
            </h2>
            {description && (
              <p id="modal-description" className="text-xs sm:text-sm text-stone-600 mt-0.5 font-body">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-hidden cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
