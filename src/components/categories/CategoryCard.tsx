import React from 'react';
import { Category } from '../../types';
import { calculateLevelProgress } from '../../domain/leveling/leveling';
import { Icon } from '../common/Icon';
import { ChevronRight } from 'lucide-react';
import { getPinClass } from '../../utils/stickyTheme';

interface CategoryCardProps {
  category: Category;
  questCount?: number;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  questCount,
  onClick,
}) => {
  const progress = calculateLevelProgress(category.xp);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative bg-[#fdfbf7] border-2 border-stone-300 hover:border-amber-500/70 rounded-xl p-4 sm:p-5 transition-all duration-200 cursor-pointer sticky-note-shadow sticky-note-hover focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:outline-hidden"
      id={`category-card-${category.id}`}
      aria-label={`Category: ${category.name}, Level ${progress.currentLevel}, ${progress.xpInCurrentLevel} of ${progress.xpRequiredForNextLevel} XP`}
    >
      {/* Brass Push Pin on Top Left */}
      <div className="absolute -top-2.5 left-4 z-20 pointer-events-none flex flex-col items-center">
        <div className={`w-3.5 h-3.5 rounded-full ${getPinClass('brass')}`} />
        <div className="w-1.5 h-1.5 bg-stone-900/25 blur-[0.5px] -mt-0.5 rounded-b-full" />
      </div>

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-300/80 flex items-center justify-center text-amber-900 shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-xs">
            <Icon name={category.icon} size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="font-handwriting font-bold text-lg text-stone-900 truncate group-hover:text-amber-900 transition-colors">
              {category.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-600 font-body">
              <span className="font-bold text-amber-800 bg-amber-200/70 px-1.5 py-0.2 rounded font-mono text-[11px]">
                LVL {progress.currentLevel}
              </span>
              {typeof questCount === 'number' && (
                <>
                  <span>•</span>
                  <span>{questCount} {questCount === 1 ? 'quest' : 'quests'}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="text-stone-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all">
          <ChevronRight size={18} />
        </div>
      </div>

      {/* Progress section styled like high-contrast index card meter */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[11px] text-stone-600 font-body">
          <span>{progress.xpInCurrentLevel} / {progress.xpRequiredForNextLevel} XP</span>
          <span className="font-mono font-bold text-amber-900">{Math.round(progress.progressPercent)}%</span>
        </div>
        <div className="w-full bg-stone-200/90 rounded-full h-2 overflow-hidden border border-stone-300">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progress.progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
