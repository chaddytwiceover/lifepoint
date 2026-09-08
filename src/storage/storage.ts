import { LifePointState } from '../types';

export const STORAGE_KEY = 'lifepoint:v1';

export const DEFAULT_STATE: LifePointState = {
  profile: null,
  categories: [],
  quests: [],
  overallXp: 0,
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
  },
  unlockedAchievements: {},
  activity: [],
  preferences: {
    soundEnabled: true,
  },
};

/**
 * Validates and normalizes arbitrary parsed data into a valid LifePointState.
 * Prevents crashes from malformed, incomplete, or corrupted storage.
 */
export function normalizeState(data: unknown): LifePointState {
  if (!data || typeof data !== 'object') {
    return { ...DEFAULT_STATE };
  }

  const obj = data as Record<string, unknown>;

  // Normalize profile
  let profile = null;
  if (obj.profile && typeof obj.profile === 'object') {
    const profObj = obj.profile as Record<string, unknown>;
    if (typeof profObj.displayName === 'string') {
      profile = {
        displayName: profObj.displayName.trim() || 'Hero',
        createdAt: typeof profObj.createdAt === 'number' ? profObj.createdAt : Date.now(),
      };
    }
  }

  // Normalize categories
  const categories = Array.isArray(obj.categories)
    ? obj.categories
        .filter((c) => c && typeof c === 'object' && typeof c.id === 'string' && typeof c.name === 'string')
        .map((c) => ({
          id: String(c.id),
          name: String(c.name).trim() || 'Untitled',
          icon: typeof c.icon === 'string' && c.icon ? c.icon : 'Tag',
          description: typeof c.description === 'string' ? c.description : undefined,
          xp: typeof c.xp === 'number' && !isNaN(c.xp) ? Math.max(0, Math.floor(c.xp)) : 0,
          createdAt: typeof c.createdAt === 'number' ? c.createdAt : Date.now(),
        }))
    : [];

  // Normalize quests
  const quests = Array.isArray(obj.quests)
    ? obj.quests
        .filter((q) => q && typeof q === 'object' && typeof q.id === 'string' && typeof q.title === 'string')
        .map((q) => ({
          id: String(q.id),
          title: String(q.title).trim() || 'Untitled Quest',
          description: typeof q.description === 'string' ? q.description : undefined,
          categoryId: typeof q.categoryId === 'string' ? q.categoryId : '',
          xpReward: typeof q.xpReward === 'number' && !isNaN(q.xpReward) ? Math.max(1, Math.floor(q.xpReward)) : 25,
          repeatable: Boolean(q.repeatable),
          status: q.status === 'completed' ? ('completed' as const) : ('active' as const),
          createdAt: typeof q.createdAt === 'number' ? q.createdAt : Date.now(),
          completedAt: typeof q.completedAt === 'number' ? q.completedAt : undefined,
          completionCount: typeof q.completionCount === 'number' ? Math.max(0, q.completionCount) : 0,
        }))
    : [];

  // Normalize overall XP
  const overallXp =
    typeof obj.overallXp === 'number' && !isNaN(obj.overallXp)
      ? Math.max(0, Math.floor(obj.overallXp))
      : 0;

  // Normalize streak
  let streak = { ...DEFAULT_STATE.streak };
  if (obj.streak && typeof obj.streak === 'object') {
    const stObj = obj.streak as Record<string, unknown>;
    streak = {
      currentStreak: typeof stObj.currentStreak === 'number' ? Math.max(0, Math.floor(stObj.currentStreak)) : 0,
      longestStreak: typeof stObj.longestStreak === 'number' ? Math.max(0, Math.floor(stObj.longestStreak)) : 0,
      lastActiveDate: typeof stObj.lastActiveDate === 'string' ? stObj.lastActiveDate : null,
    };
  }

  // Normalize unlocked achievements
  const unlockedAchievements: Record<string, number> = {};
  if (obj.unlockedAchievements && typeof obj.unlockedAchievements === 'object') {
    for (const [key, val] of Object.entries(obj.unlockedAchievements)) {
      if (typeof val === 'number') {
        unlockedAchievements[key] = val;
      }
    }
  }

  // Normalize activity
  const activity = Array.isArray(obj.activity)
    ? obj.activity
        .filter((a) => a && typeof a === 'object' && typeof a.id === 'string' && typeof a.title === 'string')
        .map((a) => ({
          id: String(a.id),
          timestamp: typeof a.timestamp === 'number' ? a.timestamp : Date.now(),
          type: (typeof a.type === 'string' ? a.type : 'quest_completed') as any,
          title: String(a.title),
          subtitle: typeof a.subtitle === 'string' ? a.subtitle : undefined,
          xp: typeof a.xp === 'number' ? a.xp : undefined,
          icon: typeof a.icon === 'string' ? a.icon : undefined,
        }))
        .slice(0, 50)
    : [];

  // Normalize preferences
  let preferences = { ...DEFAULT_STATE.preferences };
  if (obj.preferences && typeof obj.preferences === 'object') {
    const prefObj = obj.preferences as Record<string, unknown>;
    preferences = {
      soundEnabled: typeof prefObj.soundEnabled === 'boolean' ? prefObj.soundEnabled : true,
    };
  }

  return {
    profile,
    categories,
    quests,
    overallXp,
    streak,
    unlockedAchievements,
    activity,
    preferences,
  };
}

/**
 * Loads LifePoint state from browser storage with complete safety protections.
 */
export function loadLifePointState(): LifePointState | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch (error) {
    console.error('Failed to load LifePoint state from localStorage, falling back to defaults:', error);
    return null;
  }
}

/**
 * Saves LifePoint state to browser storage.
 */
export function saveLifePointState(state: LifePointState): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save LifePoint state to localStorage:', error);
  }
}

/**
 * Clears LifePoint persisted state without touching unrelated keys.
 */
export function clearLifePointState(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear LifePoint state from localStorage:', error);
  }
}
