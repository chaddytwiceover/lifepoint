import { Achievement, AchievementId, Category, StreakState } from '../../types';
import { calculateLevelProgress } from '../leveling/leveling';

export const ACHIEVEMENTS: Record<AchievementId, Omit<Achievement, 'unlockedAt'>> = {
  first_step: {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete your first quest.',
    icon: 'Footprints',
  },
  getting_started: {
    id: 'getting_started',
    title: 'Getting Started',
    description: 'Create your first category.',
    icon: 'FolderPlus',
  },
  momentum: {
    id: 'momentum',
    title: 'Momentum',
    description: 'Complete 5 quests.',
    icon: 'Flame',
  },
  level_up: {
    id: 'level_up',
    title: 'Level Up',
    description: 'Reach Level 2 in any category.',
    icon: 'TrendingUp',
  },
  specialist: {
    id: 'specialist',
    title: 'Specialist',
    description: 'Reach Level 5 in any category.',
    icon: 'Award',
  },
  explorer: {
    id: 'explorer',
    title: 'Explorer',
    description: 'Create 5 categories.',
    icon: 'Compass',
  },
  dedicated: {
    id: 'dedicated',
    title: 'Dedicated',
    description: 'Reach a 7-day streak.',
    icon: 'CalendarCheck',
  },
  century_club: {
    id: 'century_club',
    title: 'Century Club',
    description: 'Earn 100 total overall XP.',
    icon: 'ShieldCheck',
  },
  '1k_club': {
    id: '1k_club',
    title: '1K Club',
    description: 'Earn 1,000 total overall XP.',
    icon: 'Crown',
  },
};

export type AchievementEvaluationContext = {
  totalQuestsCompleted: number;
  categories: Category[];
  streak: StreakState;
  overallXp: number;
  unlockedAchievements: Record<string, number>;
};

/**
 * Checks all achievement conditions and returns an array of newly unlocked AchievementIds.
 * Ensures an achievement unlocks only once.
 */
export function evaluateNewAchievements(
  context: AchievementEvaluationContext
): AchievementId[] {
  const { totalQuestsCompleted, categories, streak, overallXp, unlockedAchievements } = context;

  const maxCategoryLevel = categories.reduce((max, cat) => {
    const { currentLevel } = calculateLevelProgress(cat.xp);
    return Math.max(max, currentLevel);
  }, 1);

  const bestStreak = Math.max(streak.currentStreak || 0, streak.longestStreak || 0);

  const newlyUnlocked: AchievementId[] = [];

  function check(id: AchievementId, conditionMet: boolean) {
    if (conditionMet && !unlockedAchievements[id]) {
      newlyUnlocked.push(id);
    }
  }

  check('first_step', totalQuestsCompleted >= 1);
  check('getting_started', categories.length >= 1);
  check('momentum', totalQuestsCompleted >= 5);
  check('level_up', maxCategoryLevel >= 2);
  check('specialist', maxCategoryLevel >= 5);
  check('explorer', categories.length >= 5);
  check('dedicated', bestStreak >= 7);
  check('century_club', overallXp >= 100);
  check('1k_club', overallXp >= 1000);

  return newlyUnlocked;
}
