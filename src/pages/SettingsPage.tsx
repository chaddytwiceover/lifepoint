import React, { useState } from 'react';
import { useLifePoint } from '../context/LifePointContext';
import { ResetConfirmModal } from '../components/settings/ResetConfirmModal';
import { AlertTriangle, Check, Shield, User } from 'lucide-react';
import { getPinClass } from '../utils/stickyTheme';

export const SettingsPage: React.FC = () => {
  const { state, updateProfile, resetAllData } = useLifePoint();

  const [displayName, setDisplayName] = useState(state.profile?.displayName || '');
  const [isSaved, setIsSaved] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    updateProfile(displayName.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const formattedJoinDate = state.profile?.createdAt
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
        new Date(state.profile.createdAt)
      )
    : 'Recently';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Plaque */}
      <div className="bg-[#fbf7ee] border-2 border-stone-300 rounded-2xl p-4 sm:p-5 shadow-lg text-stone-900">
        <div className="flex items-center gap-2 mb-0.5">
          <div className={`w-3 h-3 rounded-full ${getPinClass('yellow')}`} />
          <h1 className="text-2xl sm:text-3xl font-handwriting font-bold text-stone-900 tracking-tight">
            Desk & Journal Settings
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 font-body">
          Manage your room board owner identity and local board storage.
        </p>
      </div>

      {/* Board Owner Identity Card */}
      <div className="bg-[#fefce8] border-2 border-amber-300 rounded-2xl p-5 sm:p-6 shadow-md space-y-4 text-stone-900 sticky-note-shadow relative">
        <div className="absolute -top-3 left-6">
          <div className={`w-3 h-3 rounded-full ${getPinClass('red')}`} />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-200 border-2 border-amber-400 flex items-center justify-center text-amber-900 shadow-xs">
            <User size={20} />
          </div>
          <div>
            <h2 className="text-lg font-handwriting font-bold text-stone-900">Board Owner</h2>
            <p className="text-xs text-stone-600 font-body">Pinning quests since {formattedJoinDate}</p>
          </div>
        </div>

        <form onSubmit={handleSaveName} className="space-y-3 pt-2">
          <div>
            <label htmlFor="settings-name" className="block text-xs font-bold text-stone-700 mb-1.5 font-body">
              Your Name / Title
            </label>
            <div className="flex gap-2">
              <input
                id="settings-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={40}
                className="flex-1 bg-white border-2 border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 placeholder-stone-400 font-body focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-inner"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-handwriting font-bold bg-[#fef08a] hover:bg-[#fde047] active:bg-[#facc15] text-stone-900 border-2 border-amber-400 transition-all flex items-center gap-1 shrink-0 shadow-xs cursor-pointer"
              >
                {isSaved ? <Check size={14} /> : null}
                <span>{isSaved ? 'Saved!' : 'Save'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Storage & Privacy Info */}
      <div className="bg-[#fbf7ee] border-2 border-stone-300 rounded-2xl p-5 sm:p-6 shadow-md space-y-3 text-stone-900">
        <div className="flex items-center gap-2 text-base font-handwriting font-bold text-stone-900">
          <Shield size={18} className="text-amber-800" />
          <span>Local Storage & Board Privacy</span>
        </div>
        <p className="text-xs text-stone-600 font-body leading-relaxed">
          LifePoint operates completely locally on your device. Your quests, categories, and progress are saved in your browser’s local storage (key <code className="font-mono text-[11px] bg-amber-100 text-amber-900 px-1 py-0.5 rounded border border-amber-200">lifepoint:v1</code>). No accounts or external tracking servers are involved.
        </p>
      </div>

      {/* Danger Zone: Clear Board */}
      <div className="bg-[#fff1f2] border-2 border-rose-300 rounded-2xl p-5 sm:p-6 space-y-3 text-stone-900">
        <div className="flex items-center gap-2 text-base font-handwriting font-bold text-rose-800">
          <AlertTriangle size={18} className="text-rose-600" />
          <span>Clear Board (Danger Zone)</span>
        </div>
        <p className="text-xs text-rose-700 font-body leading-relaxed">
          Clearing the board removes all pinned sticky notes, category index cards, streaks, XP, and badges from this device. This cannot be undone.
        </p>
        <button
          type="button"
          id="reset-all-data-btn"
          onClick={() => setResetModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-handwriting font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-md focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-hidden cursor-pointer"
        >
          Clear All Board Data
        </button>
      </div>

      {/* Confirmation Modal */}
      <ResetConfirmModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={resetAllData}
      />
    </div>
  );
};
