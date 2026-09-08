import React, { useState } from 'react';
import { useLifePoint } from '../context/LifePointContext';
import { Category, Quest } from '../types';
import { QuestCard } from '../components/quests/QuestCard';
import { EmptyState } from '../components/common/EmptyState';
import { Filter, Plus, Search } from 'lucide-react';
import { getPinClass } from '../utils/stickyTheme';

interface QuestsPageProps {
  onOpenCreateQuest: (defaultCatId?: string) => void;
  onEditQuest: (quest: Quest) => void;
  onDeleteQuest: (questId: string) => void;
}

export const QuestsPage: React.FC<QuestsPageProps> = ({
  onOpenCreateQuest,
  onEditQuest,
  onDeleteQuest,
}) => {
  const { state, completeQuest } = useLifePoint();

  const [statusFilter, setStatusFilter] = useState<'active' | 'completed' | 'all'>('active');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryMap = new Map<string, Category>();
  state.categories.forEach((c) => categoryMap.set(c.id, c));

  const filteredQuests = state.quests.filter((q) => {
    // Status filter
    if (statusFilter === 'active' && q.status !== 'active') return false;
    if (statusFilter === 'completed' && q.status !== 'completed') return false;

    // Category filter
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'unassigned') {
        if (q.categoryId) return false;
      } else if (q.categoryId !== categoryFilter) {
        return false;
      }
    }

    // Search filter
    if (searchQuery.trim()) {
      const match = q.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        (q.description && q.description.toLowerCase().includes(searchQuery.trim().toLowerCase()));
      if (!match) return false;
    }

    return true;
  });

  const activeCount = state.quests.filter((q) => q.status === 'active').length;
  const completedCount = state.quests.filter((q) => q.status === 'completed').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Plaque */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fbf7ee] border-2 border-stone-300 rounded-2xl p-4 sm:p-5 shadow-lg text-stone-900">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className={`w-3 h-3 rounded-full ${getPinClass('red')}`} />
            <h1 className="text-2xl sm:text-3xl font-handwriting font-bold text-stone-900 tracking-tight">
              Your quests
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 font-body">
            Pin tasks to your board, check them off for XP, and level up your life stats.
          </p>
        </div>

        <button
          type="button"
          id="quests-add-quest-btn"
          onClick={() => onOpenCreateQuest(categoryFilter !== 'all' && categoryFilter !== 'unassigned' ? categoryFilter : undefined)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-handwriting font-bold bg-[#fef08a] hover:bg-[#fde047] active:bg-[#facc15] text-stone-900 border-2 border-amber-400 shadow-md hover:shadow-lg transition-all shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add quest</span>
        </button>
      </div>

      {/* Filter & Search Desk Tray */}
      <div className="bg-[#f5efe4] border-2 border-stone-300 rounded-xl p-3 sm:p-4 space-y-3 shadow-md">
        {/* Status Sticky Tabs */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="inline-flex bg-stone-200/80 p-1 rounded-xl text-xs font-handwriting font-bold border border-stone-300">
            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              aria-pressed={statusFilter === 'active'}
              className={`px-3 py-1.5 rounded-lg transition-all text-sm cursor-pointer ${
                statusFilter === 'active'
                  ? 'bg-[#fef9c3] text-stone-900 border border-amber-300 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('completed')}
              aria-pressed={statusFilter === 'completed'}
              className={`px-3 py-1.5 rounded-lg transition-all text-sm cursor-pointer ${
                statusFilter === 'completed'
                  ? 'bg-[#dcfce7] text-stone-900 border border-emerald-300 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Done ({completedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              aria-pressed={statusFilter === 'all'}
              className={`px-3 py-1.5 rounded-lg transition-all text-sm cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#e0f2fe] text-stone-900 border border-sky-300 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All ({state.quests.length})
            </button>
          </div>

          {/* Category Filter Selector */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-stone-600 hidden sm:block" />
            <select
              id="quests-category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border-2 border-stone-300 text-stone-800 text-xs font-body rounded-xl px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-xs cursor-pointer"
              aria-label="Filter quests by category"
            >
              <option value="all">All Categories</option>
              {state.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
        </div>

        {/* Search Input styled like lined paper note */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="search"
            aria-label="Search quests"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by title or keywords..."
            className="w-full bg-white border-2 border-stone-300 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm text-stone-900 placeholder-stone-400 font-body focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-inner"
          />
        </div>
      </div>

      {/* Sticky Notes Corkboard Grid */}
      {filteredQuests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-1">
          {filteredQuests.map((quest) => (
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
        <div className="bg-[#fefce8] border-2 border-dashed border-amber-300 rounded-2xl p-8 text-center text-stone-800 shadow-md">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl">
            📌
          </div>
          <h3 className="font-handwriting font-bold text-xl text-stone-900">
            {searchQuery
              ? 'No matching sticky notes'
              : statusFilter === 'completed'
              ? 'No completed notes yet'
              : 'No sticky notes pinned'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 font-body mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No sticky notes found matching "${searchQuery}". Try a different keyword.`
              : statusFilter === 'completed'
              ? 'Notes you check off will stay here as completed records.'
              : 'Tear off a new sticky note to get started on your goals.'}
          </p>
          {(searchQuery || categoryFilter !== 'all') && (
            <button type="button" className="mt-4 px-4 py-2 rounded-xl border border-stone-400 bg-white font-medium" onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}>
              Clear filters
            </button>
          )}
          {statusFilter !== 'completed' && !searchQuery && categoryFilter === 'all' && (
            <button
              type="button"
              onClick={() => onOpenCreateQuest()}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-handwriting font-bold bg-amber-300 hover:bg-amber-400 text-stone-900 border border-amber-500 shadow-xs cursor-pointer"
            >
              <Plus size={14} />
              <span>Pin New Note</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
