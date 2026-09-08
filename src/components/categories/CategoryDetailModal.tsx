import React, { useState } from 'react';
import { Category, Quest } from '../../types';
import { calculateLevelProgress } from '../../domain/leveling/leveling';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import { QuestCard } from '../quests/QuestCard';
import { Edit2, Plus, Trash2 } from 'lucide-react';

interface CategoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  quests: Quest[];
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onAddQuestForCategory: (categoryId: string) => void;
  onCompleteQuest: (questId: string) => void;
  onEditQuest: (quest: Quest) => void;
  onDeleteQuest: (questId: string) => void;
}

export const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({
  isOpen,
  onClose,
  category,
  quests,
  onEditCategory,
  onDeleteCategory,
  onAddQuestForCategory,
  onCompleteQuest,
  onEditQuest,
  onDeleteQuest,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');

  if (!category) return null;

  const progress = calculateLevelProgress(category.xp);
  const categoryQuests = quests.filter((q) => q.categoryId === category.id);
  const filteredQuests = categoryQuests.filter((q) => {
    if (filter === 'active') return q.status === 'active';
    if (filter === 'completed') return q.status === 'completed';
    return true;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category.name}
      description="Category Index Card & Associated Sticky Notes"
      maxWidth="md"
    >
      <div className="space-y-5 text-stone-900 font-body">
        {/* Header Hero Stats */}
        <div className="bg-[#fefce8] border-2 border-amber-300 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-amber-200 border-2 border-amber-400 flex items-center justify-center text-amber-900 shrink-0 shadow-xs">
              <Icon name={category.icon} size={24} />
            </div>
            <div>
              <div className="text-xl font-handwriting font-bold text-stone-900 flex items-center gap-2">
                <span>Level {progress.currentLevel}</span>
                <span className="text-xs font-mono font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded border border-amber-300">
                  {category.xp.toLocaleString()} total XP
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5 font-body">
                {progress.xpInCurrentLevel} / {progress.xpRequiredForNextLevel} XP to Level {progress.currentLevel + 1}
              </p>
            </div>
          </div>

          <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden border border-stone-300">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress.progressPercent}%` }}
            />
          </div>

          {category.description && (
            <p className="text-xs text-stone-700 mt-3 pt-3 border-t border-amber-200/80 leading-relaxed font-body">
              {category.description}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              onClose();
              onAddQuestForCategory(category.id);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-handwriting font-bold bg-[#fef08a] hover:bg-[#fde047] active:bg-[#facc15] text-stone-900 border-2 border-amber-400 shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>+ Pin Sticky Note</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditCategory(category);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 transition-colors cursor-pointer"
            >
              <Edit2 size={13} />
              <span>Edit Card</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onDeleteCategory(category);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Delete Card</span>
            </button>
          </div>
        </div>

        {/* Quests in this category */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider font-body">
              Associated Sticky Notes ({categoryQuests.length})
            </h4>

            {/* Filter pills */}
            <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-300 text-[11px] font-handwriting font-bold">
              {(['active', 'completed', 'all'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`px-2 py-0.5 rounded-md capitalize transition-colors cursor-pointer ${
                    filter === f
                      ? 'bg-[#fef9c3] text-stone-900 border border-amber-300 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {filteredQuests.length > 0 ? (
              filteredQuests.map((q) => (
                <QuestCard
                  key={q.id}
                  quest={q}
                  category={category}
                  onComplete={onCompleteQuest}
                  onEdit={onEditQuest}
                  onDelete={onDeleteQuest}
                />
              ))
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-stone-300 rounded-xl bg-stone-50">
                <p className="text-xs text-stone-500 font-body">
                  No {filter !== 'all' ? filter : ''} sticky notes in this category.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
