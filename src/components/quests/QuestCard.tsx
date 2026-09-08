import React, { useState } from 'react';
import { Category, Quest } from '../../types';
import { Icon } from '../common/Icon';
import { Check, Edit2, MoreVertical, Repeat, Trash2 } from 'lucide-react';
import { getStickyStyle, getPinClass } from '../../utils/stickyTheme';

interface QuestCardProps {
  quest: Quest;
  category?: Category;
  onComplete: (questId: string) => Promise<void> | void;
  onEdit: (quest: Quest) => void;
  onDelete: (questId: string) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  category,
  onComplete,
  onEdit,
  onDelete,
}) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isCompleted = quest.status === 'completed';
  const stickyStyle = getStickyStyle(quest.categoryId || quest.id);

  const handleCompleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompleting || (!quest.repeatable && isCompleted)) return;

    setIsCompleting(true);
    try {
      await onComplete(quest.id);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div
      id={`quest-card-${quest.id}`}
      className={`group relative rounded-xl transition-all duration-200 p-4 sm:p-5 sticky-note-shadow sticky-note-hover ${stickyStyle.angle} ${
        isCompleted ? 'opacity-85' : ''
      }`}
      style={{
        backgroundColor: stickyStyle.bg,
        border: `1.5px solid ${stickyStyle.border}`,
        color: stickyStyle.text,
      }}
    >
      {/* 3D Push Pin on Top Center */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
        <div className={`w-3.5 h-3.5 rounded-full ${getPinClass(stickyStyle.pinType)}`} />
        {/* Subtle pin needle drop shadow */}
        <div className="w-1.5 h-2 bg-stone-900/20 blur-[0.5px] -mt-0.5 rounded-b-full" />
      </div>

      {/* Stamped Red Ink "COMPLETED" Watermark if finished */}
      {isCompleted && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-10">
          <div className="stamp-completed px-4 py-1 text-base sm:text-lg rounded-md select-none">
            ✓ COMPLETED
          </div>
        </div>
      )}

      {/* Sticky Note Content */}
      <div className="flex items-start gap-3 relative z-0">
        {/* Hand-drawn style Completion Checkbox */}
        <button
          type="button"
          onClick={handleCompleteClick}
          disabled={isCompleting || (!quest.repeatable && isCompleted)}
          aria-label={
            quest.repeatable
              ? `Complete repeatable quest ${quest.title}`
              : isCompleted
              ? `Quest completed: ${quest.title}`
              : `Complete quest: ${quest.title}`
          }
          className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center border-2 transition-all duration-200 mt-0.5 ${
            isCompleted
              ? 'border-emerald-700 bg-emerald-600 text-white shadow-xs'
              : 'border-stone-500/70 bg-white/80 text-stone-700 hover:border-stone-800 hover:bg-white hover:scale-105 active:scale-95 cursor-pointer shadow-xs'
          } ${isCompleting ? 'animate-pulse' : ''} focus-visible:ring-2 focus-visible:ring-stone-800 focus-visible:outline-hidden`}
        >
          {isCompleted ? (
            <Check size={18} strokeWidth={3} className="text-white" />
          ) : (
            <div className="w-2.5 h-2.5 rounded-xs border border-stone-300 opacity-40 group-hover:opacity-100" />
          )}
        </button>

        {/* Quest Information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 mb-1 flex-wrap">
            <h4
              className={`font-handwriting font-bold text-lg sm:text-xl text-stone-900 leading-snug tracking-wide ${
                isCompleted ? 'line-through text-stone-500' : ''
              }`}
            >
              {quest.title}
            </h4>

            {/* Repeatable Note Stamp */}
            {quest.repeatable && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-900/10 text-stone-800 border border-stone-800/20 shrink-0"
                title={`Repeatable quest (completed ${quest.completionCount || 0} times)`}
              >
                <Repeat size={10} />
                <span>Repeatable {quest.completionCount > 0 ? `×${quest.completionCount}` : ''}</span>
              </span>
            )}
          </div>

          {/* Note Description */}
          {quest.description && (
            <p className="text-xs sm:text-sm text-stone-700 font-body leading-relaxed mb-2.5">
              {quest.description}
            </p>
          )}

          {/* Sticky Note Tags / Badges */}
          <div className="flex items-center gap-2 text-xs flex-wrap mt-2 pt-1 border-t border-stone-800/10">
            {/* Category Washi Tape Strip */}
            {category ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-white/70 border border-stone-400/40 text-stone-800 shadow-xs">
                <Icon name={category.icon} size={12} className="text-amber-700" />
                <span>{category.name}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-white/50 border border-stone-400/30 text-stone-600">
                General
              </span>
            )}

            {/* Gold Star / Price Tag XP Sticker */}
            <span className="inline-flex items-center font-bold text-[11px] px-2 py-0.5 rounded-full bg-amber-200 border border-amber-400/80 text-amber-950 shadow-xs font-mono">
              ★ +{quest.xpReward} XP
            </span>
          </div>
        </div>

        {/* Paper Clip / Options Menu */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={`Options for quest ${quest.title}`}
            aria-expanded={menuOpen}
            className="p-1 rounded-md text-stone-500 hover:text-stone-900 hover:bg-black/5 transition-colors focus-visible:ring-2 focus-visible:ring-stone-800 focus-visible:outline-hidden"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-7 z-30 w-32 bg-stone-50 border border-stone-300 rounded-lg shadow-xl py-1 text-xs text-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(quest);
                  }}
                  className="w-full text-left px-3 py-2 text-stone-800 hover:bg-amber-100 flex items-center gap-2 font-medium"
                >
                  <Edit2 size={13} className="text-stone-600" />
                  <span>Edit Note</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(quest.id);
                  }}
                  className="w-full text-left px-3 py-2 text-rose-700 hover:bg-rose-100 flex items-center gap-2 font-medium"
                >
                  <Trash2 size={13} className="text-rose-600" />
                  <span>Unpin Note</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
