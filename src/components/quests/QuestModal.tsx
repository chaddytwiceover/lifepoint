import React, { useEffect, useState } from 'react';
import { Category, Quest } from '../../types';
import { Modal } from '../common/Modal';
import { Icon } from '../common/Icon';
import { Repeat, Sparkles } from 'lucide-react';

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (questData: {
    id?: string;
    title: string;
    description?: string;
    categoryId: string;
    xpReward: number;
    repeatable: boolean;
  }) => void;
  categories: Category[];
  initialQuest?: Quest | null;
  defaultCategoryId?: string;
}

const XP_PRESETS = [
  { label: 'Small', xp: 10 },
  { label: 'Medium', xp: 25 },
  { label: 'Big', xp: 50 },
  { label: 'Boss', xp: 100 },
];

export const QuestModal: React.FC<QuestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  initialQuest,
  defaultCategoryId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [xpReward, setXpReward] = useState<number>(25);
  const [customXp, setCustomXp] = useState<string>('');
  const [isCustomXp, setIsCustomXp] = useState<boolean>(false);
  const [repeatable, setRepeatable] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialQuest) {
      setTitle(initialQuest.title);
      setDescription(initialQuest.description || '');
      setCategoryId(initialQuest.categoryId || (categories[0]?.id ?? ''));
      setRepeatable(initialQuest.repeatable);

      const isPreset = XP_PRESETS.some((p) => p.xp === initialQuest.xpReward);
      if (isPreset) {
        setXpReward(initialQuest.xpReward);
        setIsCustomXp(false);
        setCustomXp('');
      } else {
        setIsCustomXp(true);
        setXpReward(initialQuest.xpReward);
        setCustomXp(String(initialQuest.xpReward));
      }
    } else {
      setTitle('');
      setDescription('');
      setCategoryId(defaultCategoryId || (categories[0]?.id ?? ''));
      setXpReward(25);
      setIsCustomXp(false);
      setCustomXp('');
      setRepeatable(false);
    }
    setError('');
  }, [initialQuest, isOpen, defaultCategoryId, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please provide a title for the quest.');
      return;
    }

    if (!categoryId && categories.length > 0) {
      setError('Please select a category for this quest.');
      return;
    }

    let finalXp = xpReward;
    if (isCustomXp) {
      const parsed = parseInt(customXp, 10);
      if (isNaN(parsed) || parsed <= 0) {
        setError('Custom XP must be a positive number.');
        return;
      }
      finalXp = parsed;
    }

    onSubmit({
      id: initialQuest?.id,
      title: trimmedTitle,
      description: description.trim() || undefined,
      categoryId,
      xpReward: finalXp,
      repeatable,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialQuest ? 'Edit Quest' : 'Create New Quest'}
      description="Define an actionable task and turn real-life progress into XP."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm text-stone-900 font-body">
        {/* Title */}
        <div>
          <label htmlFor="quest-title" className="block text-xs font-bold text-stone-800 mb-1.5 font-body">
            Sticky Note Title <span className="text-amber-700">*</span>
          </label>
          <input
            id="quest-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. Read 20 pages, Complete 30m run, File report"
            maxLength={100}
            className="w-full bg-white border-2 border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 placeholder-stone-400 font-handwriting text-base sm:text-lg font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-inner"
            autoFocus
          />
          {error && (
            <p className="mt-1.5 text-xs text-rose-600 font-bold" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* Category Selection */}
        <div>
          <label htmlFor="quest-category" className="block text-xs font-bold text-stone-800 mb-1.5 font-body">
            Category Card <span className="text-amber-700">*</span>
          </label>
          {categories.length > 0 ? (
            <select
              id="quest-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-white border-2 border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-sm cursor-pointer shadow-xs"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-xs text-amber-800 bg-amber-100 border border-amber-300 p-2.5 rounded-xl">
              No categories available yet. You can create categories from the Categories tab.
            </p>
          )}
        </div>

        {/* XP Reward Presets & Custom */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1.5 font-body">
            XP Reward Sticker
          </label>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {XP_PRESETS.map((preset) => {
              const active = !isCustomXp && xpReward === preset.xp;
              return (
                <button
                  key={preset.xp}
                  type="button"
                  onClick={() => {
                    setIsCustomXp(false);
                    setXpReward(preset.xp);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                    active
                      ? 'border-amber-500 bg-[#fde047] text-stone-900 font-bold shadow-sm scale-102'
                      : 'border-stone-300 bg-[#fefce8] text-stone-700 hover:border-amber-400'
                  }`}
                >
                  <span className="font-handwriting font-bold text-sm">{preset.label}</span>
                  <span className="font-mono text-[11px]">+{preset.xp} XP</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsCustomXp(true);
                if (!customXp) setCustomXp('75');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-colors cursor-pointer ${
                isCustomXp
                  ? 'border-amber-500 bg-amber-100 text-amber-900'
                  : 'border-stone-300 bg-white text-stone-600 hover:text-stone-900'
              }`}
            >
              Custom XP
            </button>
            {isCustomXp && (
              <div className="flex-1 flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={customXp}
                  onChange={(e) => setCustomXp(e.target.value)}
                  placeholder="e.g. 75"
                  className="w-24 bg-white border-2 border-stone-300 rounded-lg px-2.5 py-1 text-xs text-stone-900 font-mono shadow-inner"
                />
                <span className="text-xs text-stone-600 font-bold">XP</span>
              </div>
            )}
          </div>
        </div>

        {/* Repeatable Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 p-3 rounded-xl border-2 border-stone-300 bg-[#fefce8] cursor-pointer hover:border-amber-400 transition-colors shadow-xs">
            <input
              type="checkbox"
              checked={repeatable}
              onChange={(e) => setRepeatable(e.target.checked)}
              className="mt-0.5 rounded border-stone-400 text-amber-600 focus:ring-amber-500"
            />
            <div>
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5 font-body">
                <Repeat size={13} className="text-amber-800" />
                Repeatable Sticky Note
              </span>
              <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed font-body">
                Stays on the board after completion. Can be checked off repeatedly to earn XP continuously.
              </p>
            </div>
          </label>
        </div>

        {/* Description (Optional) */}
        <div>
          <label htmlFor="quest-desc" className="block text-xs font-bold text-stone-800 mb-1.5 font-body">
            Sticky Notes Details <span className="text-stone-500 font-normal">(Optional)</span>
          </label>
          <textarea
            id="quest-desc"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add scribbles, criteria, or sub-tasks..."
            className="w-full bg-white border-2 border-stone-300 rounded-xl px-3.5 py-2 text-stone-900 placeholder-stone-400 font-body focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-sm resize-none shadow-inner"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t-2 border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-handwriting font-bold bg-[#fef08a] hover:bg-[#fde047] active:bg-[#facc15] text-stone-900 border-2 border-amber-400 shadow-md transition-all cursor-pointer"
          >
            {initialQuest ? 'Update Note' : '📌 Pin to Board'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
