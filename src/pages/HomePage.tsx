import React from 'react';
import { useLifePoint } from '../context/LifePointContext';
import { calculateLevelProgress } from '../domain/leveling/leveling';
import { CategoryCard } from '../components/categories/CategoryCard';
import { QuestCard } from '../components/quests/QuestCard';
import { EmptyState } from '../components/common/EmptyState';
import { RecentActivityFeed } from '../components/activity/RecentActivityFeed';
import { ACHIEVEMENTS } from '../domain/achievements/achievements';
import { Category, Quest } from '../types';
import { Flame, Plus, Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { getPinClass } from '../utils/stickyTheme';

interface HomePageProps {
  onOpenCreateQuest: (defaultCatId?: string) => void;
  onOpenCreateCategory: () => void;
  onOpenCategoryDetail: (category: Category) => void;
  onEditQuest: (quest: Quest) => void;
  onDeleteQuest: (questId: string) => void;
  onNavigateTab: (tab: 'quests' | 'stats' | 'achievements') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenCreateQuest,
  onOpenCreateCategory,
  onOpenCategoryDetail,
  onEditQuest,
  onDeleteQuest,
  onNavigateTab,
}) => {
  const { state, completeQuest } = useLifePoint();

  const playerProgress = calculateLevelProgress(state.overallXp);
  const activeQuests = state.quests.filter((q) => q.status === 'active');

  // Category map for quick lookup
  const categoryMap = new Map<string, Category>();
  state.categories.forEach((c) => categoryMap.set(c.id, c));

  // Recently unlocked achievements (up to 3)
  const unlockedAchEntries = Object.entries(state.unlockedAchievements)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 3);

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* Master Board Header / Clipboard Plaque */}
      <section
        aria-labelledby="player-overview-heading"
        className="relative bg-[#fbf7ee] border-2 border-stone-300 rounded-2xl p-5 sm:p-6 shadow-xl text-stone-900"
      >
        {/* Top Brass Clips holding the clipboard */}
        <div className="absolute -top-3 left-12 z-20 pointer-events-none">
          <div className="w-8 h-4 rounded-t-sm bg-gradient-to-b from-amber-200 to-amber-500 border border-amber-600 shadow-md flex items-center justify-center">
            <div className="w-3 h-1 bg-amber-800/40 rounded-full" />
          </div>
        </div>
        <div className="absolute -top-3 right-12 z-20 pointer-events-none">
          <div className="w-8 h-4 rounded-t-sm bg-gradient-to-b from-amber-200 to-amber-500 border border-amber-600 shadow-md flex items-center justify-center">
            <div className="w-3 h-1 bg-amber-800/40 rounded-full" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pt-1">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs uppercase tracking-wider font-bold text-amber-800 flex items-center gap-1 font-body">
                <Sparkles size={12} className="text-amber-600" />
                Your everyday progress
              </span>
            </div>
            <h1 id="player-overview-heading" className="text-2xl sm:text-3xl font-handwriting font-bold text-stone-900 tracking-tight">
              {state.profile?.displayName ? `${state.profile.displayName}'s Quest Board` : 'My Quest Board'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5 font-body">
              Turn real life into progress you can see.
            </p>
          </div>

          {/* Streak Matchbook & Quick Pin Action */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Streak Sticker */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold font-body shadow-xs ${
                state.streak.currentStreak > 0
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-stone-100 border-stone-300 text-stone-500'
              }`}
              title={`Current Streak: ${state.streak.currentStreak} days (Best: ${state.streak.longestStreak} days)`}
            >
              <Flame
                size={16}
                className={state.streak.currentStreak > 0 ? 'text-amber-600 fill-amber-500' : 'text-stone-400'}
              />
              <span>{state.streak.currentStreak} Day Streak</span>
            </div>

            {/* Pin New Sticky Note Button */}
            <button
              type="button"
              id="dashboard-add-quest-btn"
              onClick={() => onOpenCreateQuest()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-handwriting bg-[#fef08a] hover:bg-[#fde047] active:bg-[#facc15] text-stone-900 border-2 border-amber-400 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add quest</span>
            </button>
          </div>
        </div>

        {/* Player Level & XP Progress Styled like a Wooden Ruler / Progress Bar */}
        <div className="bg-[#f5efe4] border border-stone-300 rounded-xl p-3.5 sm:p-4">
          <div className="flex flex-wrap gap-2 justify-between items-baseline mb-2">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-lg font-handwriting font-bold text-stone-900">
                Level {playerProgress.currentLevel}
              </span>
              <span className="text-xs text-stone-600 font-body">
                {playerProgress.xpInCurrentLevel} / {playerProgress.xpRequiredForNextLevel} XP to Level {playerProgress.currentLevel + 1}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md border border-amber-300">
              {state.overallXp.toLocaleString()} Total XP
            </span>
          </div>

          <div role="progressbar" aria-label="Player level progress" aria-valuenow={Math.round(playerProgress.progressPercent)} aria-valuemin={0} aria-valuemax={100} className="w-full bg-stone-300 rounded-full h-3 overflow-hidden border border-stone-400 p-0.5">
            <div
              className="bg-amber-600 h-full rounded-full transition-all duration-500 shadow-inner"
              style={{ width: `${playerProgress.progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* Active quests Board Section */}
      <section aria-labelledby="active-quests-heading">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getPinClass('red')}`} />
            <h2 id="active-quests-heading" className="text-lg font-handwriting font-bold text-amber-100 tracking-wide drop-shadow-sm">
              Active quests
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-stone-900/80 text-amber-200 border border-amber-400/40">
              {activeQuests.length}
            </span>
          </div>

          {activeQuests.length > 0 && (
            <button
              type="button"
              onClick={() => onNavigateTab('quests')}
              className="text-xs sm:text-sm font-handwriting font-bold text-amber-200 hover:text-amber-100 flex items-center gap-1 transition-colors drop-shadow-xs"
            >
              <span>View all quests</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {activeQuests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-1">
            {activeQuests.slice(0, 6).map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                category={categoryMap.get(quest.categoryId)}
                onComplete={completeQuest}
                onEdit={onEditQuest}
                onDelete={onDeleteQuest}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#fefce8] border-2 border-dashed border-amber-300 rounded-2xl p-6 text-center text-stone-800 shadow-md">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-xl">
              📝
            </div>
            <h3 className="font-handwriting font-bold text-xl text-stone-900">Your board is clear!</h3>
            <p className="text-xs sm:text-sm text-stone-600 font-body mt-1 max-w-sm mx-auto">
              Tear off a fresh sticky note and pin your first task to start earning XP.
            </p>
            <button
              type="button"
              onClick={() => onOpenCreateQuest()}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold font-handwriting bg-amber-300 hover:bg-amber-400 text-stone-900 border border-amber-500 shadow-xs cursor-pointer"
            >
              <Plus size={14} />
              <span>Pin a Sticky Note</span>
            </button>
          </div>
        )}
      </section>

      {/* Categories Progression (Pinned Index Cards) */}
      <section aria-labelledby="categories-heading">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getPinClass('blue')}`} />
            <h2 id="categories-heading" className="text-lg font-handwriting font-bold text-amber-100 tracking-wide drop-shadow-sm">
              Life Categories
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-stone-900/80 text-amber-200 border border-amber-400/40">
              {state.categories.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {state.categories.length > 0 && (
              <button
                type="button"
                onClick={() => onNavigateTab('stats')}
                className="text-xs sm:text-sm font-handwriting font-bold text-amber-200 hover:text-amber-100 flex items-center gap-1 transition-colors"
              >
                <span>Manage</span>
                <ArrowRight size={14} />
              </button>
            )}
            <button
              type="button"
              onClick={onOpenCreateCategory}
              className="p-1.5 rounded-lg bg-stone-900/60 border border-amber-400/40 text-amber-200 hover:text-white hover:bg-stone-900 transition-colors cursor-pointer"
              title="Add Category Card"
              aria-label="Add Category Card"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {state.categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {state.categories.map((cat) => {
              const count = state.quests.filter((q) => q.categoryId === cat.id && q.status === 'active').length;
              return (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  questCount={count}
                  onClick={() => onOpenCategoryDetail(cat)}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon="Compass"
            title="No categories yet"
            description="Pin your first category index card to organize your quests."
            actionLabel="Add Category"
            onAction={onOpenCreateCategory}
          />
        )}
      </section>

      {/* Pinned Enamel Badges Section */}
      {unlockedAchEntries.length > 0 && (
        <section aria-labelledby="recent-achievements-heading">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getPinClass('brass')}`} />
              <h2 id="recent-achievements-heading" className="text-lg font-handwriting font-bold text-amber-100 tracking-wide drop-shadow-sm flex items-center gap-1.5">
                <Trophy size={16} className="text-amber-400" />
                Pinned Badges
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('achievements')}
              className="text-xs sm:text-sm font-handwriting font-bold text-amber-200 hover:text-amber-100 flex items-center gap-1 transition-colors"
            >
              <span>View all ({Object.keys(state.unlockedAchievements).length}/{Object.keys(ACHIEVEMENTS).length})</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {unlockedAchEntries.map(([id]) => {
              const ach = ACHIEVEMENTS[id as keyof typeof ACHIEVEMENTS];
              if (!ach) return null;
              return (
                <div
                  key={id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#fefce8] border-2 border-amber-300 text-stone-900 sticky-note-shadow relative"
                >
                  {/* Brass Pin */}
                  <div className="absolute -top-2 left-4">
                    <div className={`w-2.5 h-2.5 rounded-full ${getPinClass('brass')}`} />
                  </div>
                  <div className="w-9 h-9 rounded-full bg-amber-200 border-2 border-amber-500 flex items-center justify-center text-amber-900 shadow-sm shrink-0">
                    <Trophy size={16} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold font-handwriting text-stone-900 truncate">{ach.title}</h4>
                    <p className="text-[11px] text-stone-600 font-body truncate">{ach.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Pinned Activity Log / Receipt Tape */}
      <section aria-labelledby="recent-activity-heading">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-3 h-3 rounded-full ${getPinClass('yellow')}`} />
          <h2 id="recent-activity-heading" className="text-lg font-handwriting font-bold text-amber-100 tracking-wide drop-shadow-sm">
            Recent activity
          </h2>
        </div>
        <RecentActivityFeed activities={state.activity} limit={6} />
      </section>
    </div>
  );
};
