export type Category = {
  id: string;
  name: string;
  icon: string;
  description?: string;
  xp: number;
  createdAt: number;
};

export type QuestStatus = 'active' | 'completed';

export type Quest = {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  xpReward: number;
  repeatable: boolean;
  status: QuestStatus;
  createdAt: number;
  completedAt?: number;
  completionCount: number;
};

export type StreakState = {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null; // ISO YYYY-MM-DD local date
};

export type AchievementId =
  | 'first_step'
  | 'getting_started'
  | 'momentum'
  | 'level_up'
  | 'specialist'
  | 'explorer'
  | 'dedicated'
  | 'century_club'
  | '1k_club';

export type Achievement = {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
};

export type ActivityEventType =
  | 'quest_completed'
  | 'category_level_up'
  | 'player_level_up'
  | 'achievement_unlocked';

export type ActivityEvent = {
  id: string;
  timestamp: number;
  type: ActivityEventType;
  title: string;
  subtitle?: string;
  xp?: number;
  icon?: string;
};

export type UserProfile = {
  displayName: string;
  createdAt: number;
};

export type StarterTemplateId = 'student' | 'creator' | 'fitness' | 'growth' | 'blank';

export type StarterTemplate = {
  id: StarterTemplateId;
  name: string;
  description: string;
  categories: Array<{ name: string; icon: string; description?: string }>;
};

export type LifePointPreferences = {
  soundEnabled?: boolean;
};

export type LifePointState = {
  profile: UserProfile | null;
  categories: Category[];
  quests: Quest[];
  overallXp: number;
  streak: StreakState;
  unlockedAchievements: Record<string, number>; // achievementId -> unlockedAt timestamp
  activity: ActivityEvent[];
  preferences: LifePointPreferences;
};

export type NavigationTab = 'home' | 'quests' | 'stats' | 'achievements' | 'settings';
