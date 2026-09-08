import React, { useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';

const openDialogs: HTMLDivElement[] = [];
let originalBodyOverflow = '';

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
  const titleId = useId();
  const descriptionId = useId();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;

      const dialog = dialogRef.current! as HTMLDivElement;
      if (!openDialogs.length) originalBodyOverflow = document.body.style.overflow;
      openDialogs.push(dialog);
      dialog.parentElement!.style.zIndex = String(50 + openDialogs.length);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (openDialogs.at(-1) !== dialog) return;
        if (e.key === 'Escape') {
          e.preventDefault();
          closeRef.current();
        }
        if (e.key === 'Tab') {
          const items = Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')).filter(el => el.getClientRects().length > 0);
          const first = items[0];
          const last = items[items.length - 1];
          if (!first) { e.preventDefault(); dialog.focus(); }
          else if (e.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // Focus first focusable element inside modal
      const focusTimer = setTimeout(() => {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable && focusable.length > 0) {
          focusable[0].focus();
        }
      }, 50);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(focusTimer);
        openDialogs.splice(openDialogs.indexOf(dialog), 1);
        document.body.style.overflow = openDialogs.length ? 'hidden' : originalBodyOverflow;
        if (previouslyFocusedElement.current) {
          previouslyFocusedElement.current.focus();
        }
      };
    }
  }, [isOpen]);

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
        tabIndex={-1}
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={`w-full ${maxWidthClasses} bg-[#fdfbf7] border-2 border-stone-300 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 text-stone-900 max-h-[90vh] overflow-y-auto transform transition-all duration-200 relative`}
        id={`modal-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {/* Top Washi Tape strip across notepad header */}
        <div className="washi-tape-strip h-3 w-28 mx-auto -mt-6 mb-3 rounded-xs opacity-90 hidden sm:block" />

        <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b-2 border-stone-200">
          <div>
            <h2 id={titleId} className="text-xl sm:text-2xl font-handwriting font-bold tracking-tight text-stone-900">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-xs sm:text-sm text-stone-600 mt-0.5 font-body">
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
