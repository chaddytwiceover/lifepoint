import React from 'react';
import { Icon } from './Icon';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'Compass',
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-amber-300 rounded-2xl bg-[#fefce8] text-stone-900 shadow-md ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-800 mb-3 shadow-inner">
        <Icon name={icon} size={22} className="text-amber-800" />
      </div>
      <h3 className="text-lg font-handwriting font-bold text-stone-900 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-stone-600 font-body max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-handwriting font-bold bg-[#fef08a] hover:bg-[#fde047] active:bg-[#facc15] text-stone-900 border-2 border-amber-400 transition-all shadow-xs cursor-pointer"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
