import React, { useState } from 'react';
import { Category } from '../../types';
import { Modal } from '../common/Modal';
import { AlertTriangle } from 'lucide-react';

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  questCount: number;
  onConfirm: (questHandling: 'delete' | 'unassign') => void;
}

export const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  questCount,
  onConfirm,
}) => {
  const [questHandling, setQuestHandling] = useState<'unassign' | 'delete'>('unassign');

  if (!category) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Remove "${category.name}"`}
      description="Confirm removal of this category card from your board."
      maxWidth="sm"
    >
      <div className="space-y-4 text-sm text-stone-900 font-body">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 border-2 border-rose-200 text-rose-900 text-xs">
          <AlertTriangle size={18} className="shrink-0 mt-0.5 text-rose-600" />
          <p>
            Removing this category card cannot be undone. Its accumulated XP will be removed from category stats.
          </p>
        </div>

        {questCount > 0 ? (
          <div>
            <p className="text-xs font-bold text-stone-800 mb-2">
              There are {questCount} {questCount === 1 ? 'sticky note' : 'sticky notes'} assigned to this card. How would you like to handle them?
            </p>
            <div className="space-y-2">
              <label className="flex items-start gap-2.5 p-3 rounded-xl border-2 border-stone-300 bg-white cursor-pointer hover:border-amber-400">
                <input
                  type="radio"
                  name="questHandling"
                  value="unassign"
                  checked={questHandling === 'unassign'}
                  onChange={() => setQuestHandling('unassign')}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="text-xs font-bold text-stone-900">Keep sticky notes (Unassign)</span>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Preserve them on the bulletin board as unassigned notes.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border-2 border-stone-300 bg-white cursor-pointer hover:border-rose-400">
                <input
                  type="radio"
                  name="questHandling"
                  value="delete"
                  checked={questHandling === 'delete'}
                  onChange={() => setQuestHandling('delete')}
                  className="mt-0.5 text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <span className="text-xs font-bold text-rose-800">Unpin all {questCount} sticky notes</span>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Tear off and permanently remove all notes in this category.
                  </p>
                </div>
              </label>
            </div>
          </div>
        ) : (
          <p className="text-xs text-stone-600">
            No sticky notes are currently assigned to this category card.
          </p>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t-2 border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(questHandling);
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white transition-all shadow-xs cursor-pointer"
          >
            Remove Card
          </button>
        </div>
      </div>
    </Modal>
  );
};
