import React, { useEffect } from 'react';
import { Award, CheckCircle2, Trophy, X } from 'lucide-react';
import { getPinClass } from '../../utils/stickyTheme';

export type CelebrationToast = {
  id: string;
  type: 'xp' | 'level_up' | 'player_level_up' | 'achievement';
  title: string;
  subtitle?: string;
  xp?: number;
};

interface ToastCelebrationProps {
  toasts: CelebrationToast[];
  onDismiss: (id: string) => void;
}

export const ToastCelebration: React.FC<ToastCelebrationProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2.5 w-full max-w-sm px-4 pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: CelebrationToast; onDismiss: () => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const iconByType = {
    xp: <CheckCircle2 className="text-emerald-700 shrink-0" size={20} />,
    level_up: <Award className="text-amber-800 shrink-0" size={20} />,
    player_level_up: <Award className="text-purple-800 shrink-0" size={20} />,
    achievement: <Trophy className="text-amber-700 shrink-0" size={20} />,
  }[toast.type];

  return (
    <div
      role="status"
      className="pointer-events-auto flex items-center justify-between gap-3 w-full py-2.5 px-3.5 rounded-xl border-2 border-amber-400 bg-[#fef9c3] text-stone-900 shadow-xl relative sticky-note-shadow"
    >
      {/* Mini Pushpin on top left */}
      <div className="absolute -top-2 left-4 pointer-events-none">
        <div className={`w-2.5 h-2.5 rounded-full ${getPinClass('red')}`} />
      </div>

      <div className="flex items-center gap-2.5 min-w-0">
        {iconByType}
        <div className="min-w-0">
          <div className="text-sm font-handwriting font-bold tracking-wide flex items-center gap-1.5 truncate text-stone-900">
            {toast.title}
            {toast.xp && (
              <span className="text-amber-950 font-mono text-[11px] font-bold bg-amber-300 border border-amber-400 px-1.5 py-0.5 rounded">
                +{toast.xp} XP
              </span>
            )}
          </div>
          {toast.subtitle && (
            <div className="text-[11px] text-stone-700 font-body truncate">{toast.subtitle}</div>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="text-stone-500 hover:text-stone-900 p-1 rounded-md transition-colors shrink-0 cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
};
