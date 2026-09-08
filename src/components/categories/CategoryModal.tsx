import React, { useEffect, useState } from 'react';
import { Category } from '../../types';
import { Modal } from '../common/Modal';
import { AVAILABLE_ICONS, Icon } from '../common/Icon';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (categoryData: {
    id?: string;
    name: string;
    icon: string;
    description?: string;
  }) => void;
  initialCategory?: Category | null;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialCategory,
}) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Tag');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialCategory) {
      setName(initialCategory.name);
      setIcon(initialCategory.icon || 'Tag');
      setDescription(initialCategory.description || '');
    } else {
      setName('');
      setIcon('Target');
      setDescription('');
    }
    setError('');
  }, [initialCategory, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please provide a category name.');
      return;
    }

    onSubmit({
      id: initialCategory?.id,
      name: trimmed,
      icon,
      description: description.trim() || undefined,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialCategory ? 'Edit Category Card' : 'Pin New Category Card'}
      description="Define an area of your life to track and level up on the board."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm text-stone-900 font-body">
        {/* Name */}
        <div>
          <label htmlFor="category-name" className="block text-xs font-bold text-stone-800 mb-1.5 font-body">
            Category Name <span className="text-amber-700">*</span>
          </label>
          <input
            id="category-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. Strength, Deep Work, Music, Mindset"
            maxLength={40}
            className="w-full bg-white border-2 border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 placeholder-stone-400 font-handwriting text-lg font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-inner"
            autoFocus
          />
          {error && (
            <p className="mt-1.5 text-xs text-rose-600 font-bold" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* Icon Picker */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1.5 font-body">
            Card Stamp Icon
          </label>
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-2 max-h-40 overflow-y-auto p-2.5 bg-white border-2 border-stone-300 rounded-xl shadow-inner">
            {AVAILABLE_ICONS.map((icName) => {
              const selected = icon === icName;
              return (
                <button
                  key={icName}
                  type="button"
                  onClick={() => setIcon(icName)}
                  aria-label={`Select icon ${icName}`}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    selected
                      ? 'bg-amber-400 border-2 border-amber-600 text-stone-950 font-bold scale-110 shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:text-stone-950 hover:bg-stone-200'
                  }`}
                >
                  <Icon name={icName} size={16} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Description (Optional) */}
        <div>
          <label htmlFor="category-desc" className="block text-xs font-bold text-stone-800 mb-1.5 font-body">
            Description <span className="text-stone-500 font-normal">(Optional)</span>
          </label>
          <textarea
            id="category-desc"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does progress look like in this part of your life?"
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
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-handwriting font-bold bg-[#bae6fd] hover:bg-[#7dd3fc] active:bg-[#38bdf8] text-stone-900 border-2 border-sky-400 shadow-md transition-all cursor-pointer"
          >
            {initialCategory ? 'Save Changes' : '📌 Pin Category Card'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
