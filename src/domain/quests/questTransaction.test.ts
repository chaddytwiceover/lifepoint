import { describe, expect, it } from 'vitest';
import { executeQuestCompletion } from './questTransaction';
import { LifePointState } from '../../types';

describe('Quest Completion Transaction Logic', () => {
  const baseState: LifePointState = {
    profile: { displayName: 'Tester', createdAt: 1000 },
    categories: [
      { id: 'cat-1', name: 'Reading', icon: 'Book', xp: 80, createdAt: 1000 },
    ],
    quests: [
      {
        id: 'q-1',
        title: 'Read chapter 1',
        categoryId: 'cat-1',
        xpReward: 25,
        repeatable: false,
        status: 'active',
        createdAt: 1000,
        completionCount: 0,
      },
      {
        id: 'q-repeat',
        title: 'Daily pushups',
        categoryId: 'cat-1',
        xpReward: 10,
        repeatable: true,
        status: 'active',
        createdAt: 1000,
        completionCount: 0,
      },
    ],
    overallXp: 80,
    streak: { currentStreak: 0, longestStreak: 0, lastActiveDate: null },
    unlockedAchievements: {},
    activity: [],
    preferences: { soundEnabled: true },
  };

  it('completes quest, awards XP to both category and player overall', () => {
    const res = executeQuestCompletion(baseState, 'q-1', {
      timestamp: 2000,
      localDateString: '2026-09-08',
    });

    expect(res.success).toBe(true);
    if (!res.success) return;

    // Reading had 80 XP, +25 = 105 XP
    expect(res.nextState.categories[0].xp).toBe(105);
    // Overall had 80 XP, +25 = 105 XP
    expect(res.nextState.overallXp).toBe(105);
    // Streak initiated
    expect(res.nextState.streak.currentStreak).toBe(1);
    expect(res.nextState.streak.lastActiveDate).toBe('2026-09-08');

    // Leveled up! 80 -> 105 crosses threshold 100 (Level 2)
    expect(res.report.categoryLevelUp?.leveledUp).toBe(true);
    expect(res.report.categoryLevelUp?.newLevel).toBe(2);
    expect(res.report.playerLevelUp?.leveledUp).toBe(true);
    expect(res.report.playerLevelUp?.newLevel).toBe(2);

    // Achievements: first_step, level_up, century_club unlocked!
    expect(res.report.newAchievements).toContain('first_step');
    expect(res.report.newAchievements).toContain('level_up');
    expect(res.report.newAchievements).toContain('century_club');

    // Quest is now marked completed
    const updatedQ = res.nextState.quests.find((q) => q.id === 'q-1');
    expect(updatedQ?.status).toBe('completed');
    expect(updatedQ?.completionCount).toBe(1);
  });

  it('prevents non-repeatable quest from awarding XP twice (duplicate prevention)', () => {
    const res1 = executeQuestCompletion(baseState, 'q-1');
    expect(res1.success).toBe(true);
    if (!res1.success) return;

    // Try completing again
    const res2 = executeQuestCompletion(res1.nextState, 'q-1');
    expect(res2.success).toBe(false);
    if (!res2.success) {
      expect((res2 as { reason: string }).reason).toBe('already_completed');
    }
  });

  it('allows repeatable quest to be completed multiple times, keeping status active and incrementing count', () => {
    const res1 = executeQuestCompletion(baseState, 'q-repeat', {
      timestamp: 2000,
      localDateString: '2026-09-08',
    });
    expect(res1.success).toBe(true);
    if (!res1.success) return;

    expect(res1.nextState.quests.find((q) => q.id === 'q-repeat')?.status).toBe('active');
    expect(res1.nextState.quests.find((q) => q.id === 'q-repeat')?.completionCount).toBe(1);

    // Second completion
    const res2 = executeQuestCompletion(res1.nextState, 'q-repeat', {
      timestamp: 3000,
      localDateString: '2026-09-08',
    });
    expect(res2.success).toBe(true);
    if (!res2.success) return;

    expect(res2.nextState.quests.find((q) => q.id === 'q-repeat')?.status).toBe('active');
    expect(res2.nextState.quests.find((q) => q.id === 'q-repeat')?.completionCount).toBe(2);
    // 80 + 10 + 10 = 100 XP
    expect(res2.nextState.overallXp).toBe(100);
  });

  it('returns quest_not_found for invalid quest ID', () => {
    const res = executeQuestCompletion(baseState, 'non-existent-id');
    expect(res.success).toBe(false);
    if (!res.success) {
      expect((res as { reason: string }).reason).toBe('quest_not_found');
    }
  });
});
