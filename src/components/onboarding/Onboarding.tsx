import React, { useState } from 'react';
import { StarterTemplateId } from '../../types';
import { STARTER_TEMPLATES } from '../../data/starterTemplates';
import { useLifePoint } from '../../context/LifePointContext';
import { Icon } from '../common/Icon';
import { ArrowRight, Check } from 'lucide-react';
import { getPinClass } from '../../utils/stickyTheme';

export const Onboarding: React.FC = () => {
  const { initializeProfile } = useLifePoint();
  const [displayName, setDisplayName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<StarterTemplateId>('blank');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = displayName.trim();
    if (!trimmed) {
      setError('Please enter your name to personalize your board.');
      return;
    }
    initializeProfile(trimmed, selectedTemplate);
  };

  return (
    <main className="min-h-screen room-wall-bg text-stone-900 flex items-center justify-center p-4 sm:p-6">
      {/* Framed Corkboard Welcome Card */}
      <div className="w-full max-w-xl corkboard-surface border-8 sm:border-12 border-[#5c371a] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        {/* Metal wall brackets at top corners */}
        <div className="absolute -top-3.5 left-8 w-6 h-5 bg-[#3a2210] rounded-t-md border-t-2 border-x-2 border-[#6d4420] shadow-md flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-amber-200/50" />
        </div>
        <div className="absolute -top-3.5 right-8 w-6 h-5 bg-[#3a2210] rounded-t-md border-t-2 border-x-2 border-[#6d4420] shadow-md flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-amber-200/50" />
        </div>

        {/* Pinned Welcome Note */}
        <div className="bg-[#fefce8] border-2 border-amber-300 rounded-2xl p-5 sm:p-6 mb-6 sticky-note-shadow relative text-center">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <div className={`w-4 h-4 rounded-full ${getPinClass('red')}`} />
          </div>

          <span className="inline-block text-3xl mb-1">📌</span>
          <h1 className="text-3xl sm:text-4xl font-handwriting font-bold text-stone-900 mb-1">
            LifePoint Board
          </h1>
          <p className="text-sm font-handwriting text-stone-700 text-lg">
            Turn real life into progress you can see.
          </p>
          <p className="text-xs text-stone-500 font-body mt-1">
            Your personal room bulletin board for life goals, daily quests, and streaks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Display Name Paper Input */}
          <div className="bg-[#fdfbf7] border-2 border-stone-300 rounded-2xl p-4 shadow-md relative">
            <div className="absolute -top-2.5 left-4">
              <div className={`w-3 h-3 rounded-full ${getPinClass('brass')}`} />
            </div>
            <label htmlFor="display-name" className="block text-xs font-bold text-stone-800 mb-1.5 font-body">
              Who does this board belong to?
            </label>
            <input
              id="display-name"
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Alex, Sam, Commander"
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

          {/* Starter Template Selection */}
          <div className="bg-[#fdfbf7] border-2 border-stone-300 rounded-2xl p-4 shadow-md relative">
            <div className="absolute -top-2.5 left-4">
              <div className={`w-3 h-3 rounded-full ${getPinClass('blue')}`} />
            </div>

            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-stone-800 font-body">
                Choose starter index cards
              </label>
              <span className="text-[11px] text-stone-500 font-body">Fully customizable anytime</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {STARTER_TEMPLATES.map((tpl) => {
                const isSelected = selectedTemplate === tpl.id;
                const isBlank = tpl.id === 'blank';

                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={`text-left p-3 rounded-xl border-2 transition-all flex items-start justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-[#fef9c3] shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-handwriting font-bold text-stone-900">
                          {tpl.name}
                        </span>
                        {isBlank && (
                          <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">
                            Blank Slate
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 font-body mb-1.5 leading-relaxed">
                        {tpl.description}
                      </p>

                      {tpl.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {tpl.categories.map((c) => (
                            <span
                              key={c.name}
                              className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white/80 text-stone-800 border border-stone-300"
                            >
                              <Icon name={c.icon} size={10} className="text-amber-800" />
                              <span>{c.name}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-amber-600 bg-amber-400 text-stone-950'
                          : 'border-stone-300 bg-stone-100 text-transparent'
                      }`}
                    >
                      <Check size={12} strokeWidth={3} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mount Board Button */}
          <button
            type="submit"
            id="start-lifepoint-btn"
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl font-handwriting font-bold text-lg bg-[#fef08a] hover:bg-[#fde047] active:bg-[#facc15] text-stone-900 border-2 border-amber-400 transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            <span>📌 Mount My Quest Board</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </main>
  );
};
