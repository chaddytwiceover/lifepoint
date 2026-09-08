import React from 'react';
import { Modal } from '../common/Modal';
import { AlertOctagon } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Clear Bulletin Board?"
      description="This action will permanently erase your local board progress."
      maxWidth="sm"
    >
      <div className="space-y-4 text-sm text-stone-900 font-body">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border-2 border-rose-200 text-rose-900 text-xs leading-relaxed">
          <AlertOctagon size={20} className="shrink-0 text-rose-600 mt-0.5" />
          <p>
            Warning: All your pinned sticky notes, category index cards, XP points, levels, daily streaks, and enamel badges will be permanently removed from this browser.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t-2 border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            Keep My Board
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white transition-all shadow-xs cursor-pointer"
          >
            Yes, Clear Board
          </button>
        </div>
      </div>
    </Modal>
  );
};
