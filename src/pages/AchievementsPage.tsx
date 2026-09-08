import React from 'react';
import { useLifePoint } from '../context/LifePointContext';
import { ACHIEVEMENTS } from '../domain/achievements/achievements';
import { AchievementId } from '../types';
import { Icon } from '../components/common/Icon';
import { Check, Lock, Trophy } from 'lucide-react';
import { getPinClass } from '../utils/stickyTheme';

export const AchievementsPage: React.FC = () => {
  const { state } = useLifePoint();

  const allAchievementKeys = Object.keys(ACHIEVEMENTS) as AchievementId[];
  const unlockedCount = Object.keys(state.unlockedAchievements).length;
  const totalCount = allAchievementKeys.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const formatUnlockDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(timestamp));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Plaque */}
      <div className="bg-[#fbf7ee] border-2 border-stone-300 rounded-2xl p-4 sm:p-5 shadow-lg text-stone-900">
        <div className="flex items-center gap-2 mb-0.5">
          <div className={`w-3 h-3 rounded-full ${getPinClass('brass')}`} />
          <h1 className="text-2xl sm:text-3xl font-handwriting font-bold text-stone-900 tracking-tight">
            Enamel Pin & Badge Collection
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 font-body">
          Milestone pins awarded for keeping streaks, completing quests, and leveling up your life.
        </p>
      </div>

      {/* Progress Summary Pinned Card */}
      <div className="bg-[#fefce8] border-2 border-amber-300 rounded-2xl p-5 shadow-md text-stone-900 sticky-note-shadow relative">
        <div className="absolute -top-3 left-6">
          <div className={`w-3.5 h-3.5 rounded-full ${getPinClass('red')}`} />
        </div>

        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-200 border-2 border-amber-500 flex items-center justify-center text-amber-900 shadow-xs shrink-0">
              <Trophy size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold font-handwriting text-stone-900 text-base">Collection Progress</h2>
              <p className="text-xs text-stone-600 font-body">
                {unlockedCount} of {totalCount} Badges Pinned
              </p>
            </div>
          </div>
          <span className="font-mono text-xl font-bold text-amber-900">{progressPercent}%</span>
        </div>

        <div className="w-full bg-stone-300 rounded-full h-3 overflow-hidden border border-stone-400 p-0.5">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Enamel Pins Board Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {allAchievementKeys.map((id) => {
          const ach = ACHIEVEMENTS[id];
          const unlockedTimestamp = state.unlockedAchievements[id];
          const isUnlocked = typeof unlockedTimestamp === 'number';

          return (
            <div
              key={id}
              className={`p-4 rounded-xl border-2 transition-all relative ${
                isUnlocked
                  ? 'bg-[#fefce8] border-amber-400 shadow-md sticky-note-shadow'
                  : 'bg-[#f4efe6]/80 border-stone-300 opacity-60'
              }`}
            >
              {/* Push Pin */}
              <div className="absolute -top-2.5 left-4 z-10">
                <div className={`w-3 h-3 rounded-full ${isUnlocked ? getPinClass('brass') : 'bg-stone-400'}`} />
              </div>

              <div className="flex items-start gap-3.5 pt-1">
                {/* Enamel Badge Icon */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shrink-0 shadow-sm ${
                    isUnlocked
                      ? 'bg-amber-100 border-amber-500 text-amber-900 ring-2 ring-amber-300/60'
                      : 'bg-stone-200 border-stone-400 text-stone-500'
                  }`}
                >
                  {isUnlocked ? <Icon name={ach.icon} size={22} /> : <Lock size={18} />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className={`text-base font-handwriting font-bold truncate ${isUnlocked ? 'text-stone-900' : 'text-stone-600'}`}>
                      {ach.title}
                    </h3>
                    {isUnlocked && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded shrink-0 font-body">
                        <Check size={10} strokeWidth={3} />
                        <span>Pinned</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 font-body leading-relaxed mb-2">
                    {ach.description}
                  </p>

                  {isUnlocked ? (
                    <p className="text-[11px] font-body text-amber-900/80 bg-amber-100/60 px-2 py-0.5 rounded border border-amber-200 inline-block">
                      ★ Earned on {formatUnlockDate(unlockedTimestamp)}
                    </p>
                  ) : (
                    <p className="text-[11px] text-stone-500 flex items-center gap-1 font-body">
                      <Lock size={10} />
                      <span>Locked badge</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
