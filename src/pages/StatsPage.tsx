import React from 'react';
import { useLifePoint } from '../context/LifePointContext';
import { Category } from '../types';
import { calculateLevelProgress } from '../domain/leveling/leveling';
import { Icon } from '../components/common/Icon';
import { EmptyState } from '../components/common/EmptyState';
import { ArrowDown, ArrowUp, Edit2, Plus, Trash2 } from 'lucide-react';
import { getPinClass } from '../utils/stickyTheme';

interface StatsPageProps {
  onOpenCreateCategory: () => void;
  onOpenCategoryDetail: (category: Category) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
}

export const StatsPage: React.FC<StatsPageProps> = ({
  onOpenCreateCategory,
  onOpenCategoryDetail,
  onEditCategory,
  onDeleteCategory,
}) => {
  const { state, reorderCategories } = useLifePoint();

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const next = [...state.categories];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    reorderCategories(next);
  };

  const handleMoveDown = (index: number) => {
    if (index >= state.categories.length - 1) return;
    const next = [...state.categories];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    reorderCategories(next);
  };

  // High-level aggregate metrics
  const totalCategoryXp = state.categories.reduce((sum, c) => sum + c.xp, 0);
  const highestLevelCategory = state.categories.reduce<{ name: string; level: number } | null>(
    (highest, cat) => {
      const { currentLevel } = calculateLevelProgress(cat.xp);
      if (!highest || currentLevel > highest.level) {
        return { name: cat.name, level: currentLevel };
      }
      return highest;
    },
    null
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Plaque */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fbf7ee] border-2 border-stone-300 rounded-2xl p-4 sm:p-5 shadow-lg text-stone-900">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className={`w-3 h-3 rounded-full ${getPinClass('blue')}`} />
            <h1 className="text-2xl sm:text-3xl font-handwriting font-bold text-stone-900 tracking-tight">
              Life Category Index Cards
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 font-body">
            Inspect category levels, adjust ranking, and tailor your life areas.
          </p>
        </div>

        <button
          type="button"
          id="stats-add-category-btn"
          onClick={onOpenCreateCategory}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-handwriting font-bold bg-[#bae6fd] hover:bg-[#7dd3fc] text-stone-900 border-2 border-sky-400 shadow-md hover:shadow-lg transition-all shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>+ Pin New Category</span>
        </button>
      </div>

      {/* Pinned Metric Index Strips */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#fefce8] border-2 border-amber-300 rounded-xl p-3 sm:p-4 text-center sticky-note-shadow">
          <p className="text-[11px] text-stone-600 font-bold uppercase tracking-wider mb-1 font-body">Categories</p>
          <p className="text-lg sm:text-2xl font-handwriting font-bold text-stone-900">{state.categories.length}</p>
        </div>
        <div className="bg-[#fefce8] border-2 border-amber-300 rounded-xl p-3 sm:p-4 text-center sticky-note-shadow">
          <p className="text-[11px] text-stone-600 font-bold uppercase tracking-wider mb-1 font-body">Total XP</p>
          <p className="text-lg sm:text-2xl font-mono font-bold text-amber-900">{totalCategoryXp.toLocaleString()}</p>
        </div>
        <div className="bg-[#fefce8] border-2 border-amber-300 rounded-xl p-3 sm:p-4 text-center sticky-note-shadow">
          <p className="text-[11px] text-stone-600 font-bold uppercase tracking-wider mb-1 font-body">Top Tier</p>
          <p className="text-lg sm:text-2xl font-handwriting font-bold text-stone-900 truncate">
            {highestLevelCategory ? `Lvl ${highestLevelCategory.level}` : '—'}
          </p>
        </div>
      </div>

      {/* Pinned Index Cards List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-handwriting font-bold text-amber-100 drop-shadow-sm">
            Pinned Life Categories
          </h2>
          <span className="text-xs text-amber-200/80 font-body">Use arrows to reorder cards</span>
        </div>

        {state.categories.length > 0 ? (
          <div className="space-y-3.5">
            {state.categories.map((category, index) => {
              const progress = calculateLevelProgress(category.xp);
              const questCount = state.quests.filter((q) => q.categoryId === category.id).length;

              return (
                <div
                  key={category.id}
                  className="bg-[#fdfbf7] border-2 border-stone-300 rounded-xl p-4 sm:p-5 transition-all hover:border-amber-500/70 sticky-note-shadow relative text-stone-900"
                >
                  {/* Push Pin on Top Left */}
                  <div className="absolute -top-2.5 left-4 z-20 pointer-events-none">
                    <div className={`w-3.5 h-3.5 rounded-full ${getPinClass('brass')}`} />
                  </div>

                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className="flex items-center gap-3 min-w-0 cursor-pointer group flex-1"
                      onClick={() => onOpenCategoryDetail(category)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                        <Icon name={category.icon} size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-handwriting font-bold text-stone-900 group-hover:text-amber-900 transition-colors truncate">
                            {category.name}
                          </h3>
                          <span className="text-xs font-bold font-mono text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded border border-amber-300">
                            LVL {progress.currentLevel}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 font-body mt-0.5">
                          {category.xp.toLocaleString()} XP • {questCount} {questCount === 1 ? 'quest' : 'quests'}
                        </p>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        aria-label={`Move ${category.name} up`}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === state.categories.length - 1}
                        aria-label={`Move ${category.name} down`}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                      >
                        <ArrowDown size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditCategory(category)}
                        aria-label={`Edit ${category.name}`}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteCategory(category)}
                        aria-label={`Delete ${category.name}`}
                        className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-100 transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Level Progression Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] text-stone-600 font-body">
                      <span>{progress.xpInCurrentLevel} / {progress.xpRequiredForNextLevel} XP</span>
                      <span className="font-mono font-bold text-amber-900">{Math.round(progress.progressPercent)}%</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden border border-stone-300">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon="Layers"
            title="No categories yet"
            description="Create your first category card to define areas of real life."
            actionLabel="Add Category"
            onAction={onOpenCreateCategory}
          />
        )}
      </div>
    </div>
  );
};
