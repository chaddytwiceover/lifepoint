import React from 'react';
import { ActivityEvent } from '../../types';
import { Icon } from '../common/Icon';
import { Clock } from 'lucide-react';

interface RecentActivityFeedProps {
  activities: ActivityEvent[];
  limit?: number;
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  activities,
  limit = 10,
}) => {
  const displayed = activities.slice(0, limit);

  if (displayed.length === 0) {
    return (
      <div className="text-center py-6 border-2 border-dashed border-amber-300 rounded-xl bg-[#fefce8] text-xs text-stone-600 font-body shadow-xs">
        No board activity logged yet. Check off a sticky note to start your log!
      </div>
    );
  }

  const formatRelativeTime = (timestamp: number) => {
    const diffSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    if (diffSeconds < 60) return 'Just now';
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getEventBadge = (event: ActivityEvent) => {
    switch (event.type) {
      case 'quest_completed':
        return {
          icon: 'CheckCircle2',
          badgeBg: 'bg-emerald-100 border-emerald-300 text-emerald-800',
        };
      case 'category_level_up':
        return {
          icon: 'TrendingUp',
          badgeBg: 'bg-cyan-100 border-cyan-300 text-cyan-800',
        };
      case 'player_level_up':
        return {
          icon: 'Award',
          badgeBg: 'bg-purple-100 border-purple-300 text-purple-800',
        };
      case 'achievement_unlocked':
        return {
          icon: 'Trophy',
          badgeBg: 'bg-amber-100 border-amber-300 text-amber-800',
        };
      default:
        return {
          icon: 'Sparkles',
          badgeBg: 'bg-stone-100 border-stone-300 text-stone-800',
        };
    }
  };

  return (
    <div className="bg-[#fefce8] border-2 border-stone-300 rounded-2xl p-4 sm:p-5 sticky-note-shadow text-stone-900 space-y-2.5">
      {displayed.map((event) => {
        const badge = getEventBadge(event);
        return (
          <div
            key={event.id}
            className="flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-xl bg-white/70 border border-stone-200 hover:bg-white transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center border shrink-0 ${badge.badgeBg}`}
              >
                <Icon name={event.icon || badge.icon} size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-handwriting font-bold text-stone-900 truncate">
                  {event.title}
                </p>
                {event.subtitle && (
                  <p className="text-[11px] text-stone-600 font-body truncate">{event.subtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {typeof event.xp === 'number' && (
                <span className="font-mono text-[11px] font-bold text-amber-900 bg-amber-200/80 border border-amber-300 px-1.5 py-0.5 rounded">
                  +{event.xp} XP
                </span>
              )}
              <span className="text-[10px] text-stone-500 flex items-center gap-1 font-body">
                <Clock size={10} />
                {formatRelativeTime(event.timestamp)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
