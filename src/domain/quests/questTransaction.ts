import {
  AchievementId,
  ActivityEvent,
  LifePointState,
  Quest,
} from '../../types';
import { ACHIEVEMENTS, evaluateNewAchievements } from '../achievements/achievements';
import { calculateLevelProgress, didLevelUp } from '../leveling/leveling';
import { calculateStreakUpdate, getLocalDateString } from '../streaks/streak';

export type QuestCompletionReport = {
  quest: Quest;
  categoryName: string;
  xpAwarded: number;
  categoryLevelUp: {
    leveledUp: boolean;
    oldLevel: number;
    newLevel: number;
    categoryName: string;
  } | null;
  playerLevelUp: {
    leveledUp: boolean;
    oldLevel: number;
    newLevel: number;
  } | null;
  newAchievements: AchievementId[];
  updatedStreak: number;
};

export type QuestTransactionSuccess = {
  success: true;
  nextState: LifePointState;
  report: QuestCompletionReport;
};

export type QuestTransactionError = {
  success: false;
  reason: 'quest_not_found' | 'already_completed' | 'invalid_xp' | 'category_not_found';
};

export type QuestTransactionResult = QuestTransactionSuccess | QuestTransactionError;

const MAX_ACTIVITY_HISTORY = 50;

/**
 * Executes a single atomic quest completion transaction according to LifePoint rules.
 */
export function executeQuestCompletion(
  state: LifePointState,
  questId: string,
  options?: { timestamp?: number; localDateString?: string }
): QuestTransactionResult {
  const timestamp = options?.timestamp ?? Date.now();
  const dateStr = options?.localDateString ?? getLocalDateString(new Date(timestamp));

  // 1. Validate quest eligibility
  const questIndex = state.quests.findIndex((q) => q.id === questId);
  if (questIndex === -1) {
    return { success: false, reason: 'quest_not_found' };
  }

  const quest = state.quests[questIndex];
  if (!quest.repeatable && quest.status === 'completed') {
    return { success: false, reason: 'already_completed' };
  }

  const xpReward = Math.max(1, Math.floor(quest.xpReward || 0));

  // Find assigned category (if category was deleted, fallback cleanly)
  const categoryIndex = state.categories.findIndex((c) => c.id === quest.categoryId);
  const category = categoryIndex !== -1 ? state.categories[categoryIndex] : null;
  const categoryName = category ? category.name : 'General';

  // 2. Calculate category level changes & update category XP
  const oldCategoryXp = category ? category.xp : 0;
  const newCategoryXp = oldCategoryXp + xpReward;
  const categoryLevelChange = category ? didLevelUp(oldCategoryXp, newCategoryXp) : null;

  // 3. Calculate overall player level changes & update overall XP
  const oldOverallXp = state.overallXp || 0;
  const newOverallXp = oldOverallXp + xpReward;
  const playerLevelChange = didLevelUp(oldOverallXp, newOverallXp);

  // 4. Update quest status
  const updatedQuest: Quest = {
    ...quest,
    status: quest.repeatable ? 'active' : 'completed',
    completedAt: timestamp,
    completionCount: (quest.completionCount || 0) + 1,
  };

  const nextQuests = [...state.quests];
  nextQuests[questIndex] = updatedQuest;

  // Update categories array
  const nextCategories = state.categories.map((c) =>
    c.id === quest.categoryId ? { ...c, xp: newCategoryXp } : c
  );

  // 5. Update streak
  const nextStreak = calculateStreakUpdate(state.streak, dateStr);

  // 6. Check achievement conditions
  // Count total completed quests across all quests
  const totalCompletedQuestsCount = nextQuests.reduce(
    (sum, q) => sum + (q.completionCount || (q.status === 'completed' ? 1 : 0)),
    0
  );

  const newAchievementIds = evaluateNewAchievements({
    totalQuestsCompleted: totalCompletedQuestsCount,
    categories: nextCategories,
    streak: nextStreak,
    overallXp: newOverallXp,
    unlockedAchievements: state.unlockedAchievements,
  });

  const nextUnlockedAchievements = { ...state.unlockedAchievements };
  newAchievementIds.forEach((id) => {
    nextUnlockedAchievements[id] = timestamp;
  });

  // 7. Add appropriate activity events
  const newActivities: ActivityEvent[] = [];

  // Quest completed event
  newActivities.push({
    id: `act_${timestamp}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp,
    type: 'quest_completed',
    title: `Completed "${quest.title}"`,
    subtitle: `+${xpReward} XP · ${categoryName}`,
    xp: xpReward,
    icon: 'CheckCircle2',
  });

  // Category level-up event
  if (categoryLevelChange && categoryLevelChange.leveledUp) {
    newActivities.push({
      id: `act_${timestamp}_lvl_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: timestamp + 1,
      type: 'category_level_up',
      title: `${categoryName} reached Level ${categoryLevelChange.newLevel}!`,
      subtitle: `Level Up · ${categoryName}`,
      icon: 'TrendingUp',
    });
  }

  // Player level-up event
  if (playerLevelChange && playerLevelChange.leveledUp) {
    newActivities.push({
      id: `act_${timestamp}_plvl_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: timestamp + 2,
      type: 'player_level_up',
      title: `Player reached Level ${playerLevelChange.newLevel}!`,
      subtitle: `Player Level Up`,
      icon: 'Award',
    });
  }

  // Achievement unlock events
  newAchievementIds.forEach((id, idx) => {
    const achMeta = ACHIEVEMENTS[id];
    newActivities.push({
      id: `act_${timestamp}_ach_${idx}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: timestamp + 3 + idx,
      type: 'achievement_unlocked',
      title: `Achievement Unlocked: ${achMeta.title}`,
      subtitle: achMeta.description,
      icon: 'Trophy',
    });
  });

  // Keep latest MAX_ACTIVITY_HISTORY events
  const nextActivity = [...newActivities.reverse(), ...state.activity].slice(0, MAX_ACTIVITY_HISTORY);

  const nextState: LifePointState = {
    ...state,
    quests: nextQuests,
    categories: nextCategories,
    overallXp: newOverallXp,
    streak: nextStreak,
    unlockedAchievements: nextUnlockedAchievements,
    activity: nextActivity,
  };

  const report: QuestCompletionReport = {
    quest: updatedQuest,
    categoryName,
    xpAwarded: xpReward,
    categoryLevelUp:
      categoryLevelChange && categoryLevelChange.leveledUp
        ? {
            leveledUp: true,
            oldLevel: categoryLevelChange.oldLevel,
            newLevel: categoryLevelChange.newLevel,
            categoryName,
          }
        : null,
    playerLevelUp:
      playerLevelChange && playerLevelChange.leveledUp
        ? {
            leveledUp: true,
            oldLevel: playerLevelChange.oldLevel,
            newLevel: playerLevelChange.newLevel,
          }
        : null,
    newAchievements: newAchievementIds,
    updatedStreak: nextStreak.currentStreak,
  };

  return {
    success: true,
    nextState,
    report,
  };
}
