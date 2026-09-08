import { describe, expect, it } from 'vitest';
import { evaluateNewAchievements } from './achievements';
import { Category, StreakState } from '../../types';

describe('Achievements Domain Logic', () => {
  const dummyStreak: StreakState = { currentStreak: 1, longestStreak: 1, lastActiveDate: '2026-09-08' };

  it('unlocks "First Step" on completing first quest', () => {
    const newly = evaluateNewAchievements({
      totalQuestsCompleted: 1,
      categories: [],
      streak: dummyStreak,
      overallXp: 10,
      unlockedAchievements: {},
    });

    expect(newly).toContain('first_step');
  });

  it('unlocks "Getting Started" on creating first category', () => {
    const cats: Category[] = [
      { id: '1', name: 'Work', icon: 'Briefcase', xp: 0, createdAt: 1 },
    ];
    const newly = evaluateNewAchievements({
      totalQuestsCompleted: 0,
      categories: cats,
      streak: { currentStreak: 0, longestStreak: 0, lastActiveDate: null },
      overallXp: 0,
      unlockedAchievements: {},
    });

    expect(newly).toContain('getting_started');
  });

  it('unlocks "Momentum" after 5 quests are completed', () => {
    const newly = evaluateNewAchievements({
      totalQuestsCompleted: 5,
      categories: [],
      streak: dummyStreak,
      overallXp: 50,
      unlockedAchievements: { first_step: 100 },
    });

    expect(newly).toContain('momentum');
    expect(newly).not.toContain('first_step'); // already unlocked
  });

  it('unlocks "Level Up" when any category reaches Level 2 (100 XP)', () => {
    const cats: Category[] = [
      { id: '1', name: 'Focus', icon: 'Target', xp: 100, createdAt: 1 },
    ];
    const newly = evaluateNewAchievements({
      totalQuestsCompleted: 4,
      categories: cats,
      streak: dummyStreak,
      overallXp: 100,
      unlockedAchievements: {},
    });

    expect(newly).toContain('level_up');
    expect(newly).toContain('century_club'); // overallXp >= 100
  });

  it('unlocks "Specialist" when any category reaches Level 5 (700 XP)', () => {
    const cats: Category[] = [
      { id: '1', name: 'Art', icon: 'Palette', xp: 750, createdAt: 1 },
    ];
    const newly = evaluateNewAchievements({
      totalQuestsCompleted: 10,
      categories: cats,
      streak: dummyStreak,
      overallXp: 750,
      unlockedAchievements: { level_up: 100, century_club: 100 },
    });

    expect(newly).toContain('specialist');
  });

  it('unlocks "Explorer" when 5 categories are created', () => {
    const cats: Category[] = [1, 2, 3, 4, 5].map((i) => ({
      id: String(i),
      name: `Cat ${i}`,
      icon: 'Tag',
      xp: 0,
      createdAt: i,
    }));

    const newly = evaluateNewAchievements({
      totalQuestsCompleted: 0,
      categories: cats,
      streak: { currentStreak: 0, longestStreak: 0, lastActiveDate: null },
      overallXp: 0,
      unlockedAchievements: { getting_started: 100 },
    });

    expect(newly).toContain('explorer');
  });

  it('unlocks "Dedicated" when streak reaches 7 days', () => {
    const newly = evaluateNewAchievements({
      totalQuestsCompleted: 7,
      categories: [],
      streak: { currentStreak: 7, longestStreak: 7, lastActiveDate: '2026-09-08' },
      overallXp: 70,
      unlockedAchievements: {},
    });

    expect(newly).toContain('dedicated');
  });

  it('unlocks "1K Club" when overall XP reaches 1,000', () => {
    const newly = evaluateNewAchievements({
      totalQuestsCompleted: 20,
      categories: [],
      streak: dummyStreak,
      overallXp: 1000,
      unlockedAchievements: { century_club: 100 },
    });

    expect(newly).toContain('1k_club');
  });

  it('never unlocks an achievement twice', () => {
    const newly = evaluateNewAchievements({
      totalQuestsCompleted: 10,
      categories: [],
      streak: { currentStreak: 10, longestStreak: 10, lastActiveDate: '2026-09-08' },
      overallXp: 2000,
      unlockedAchievements: {
        first_step: 1,
        getting_started: 1,
        momentum: 1,
        level_up: 1,
        specialist: 1,
        explorer: 1,
        dedicated: 1,
        century_club: 1,
        '1k_club': 1,
      },
    });

    expect(newly).toHaveLength(0);
  });
});
