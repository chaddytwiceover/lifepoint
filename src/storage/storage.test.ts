import { describe, expect, it } from 'vitest';
import { DEFAULT_STATE, normalizeState } from './storage';

describe('Storage Logic & Safety', () => {
  it('returns default state when given null or undefined input', () => {
    expect(normalizeState(null)).toEqual(DEFAULT_STATE);
    expect(normalizeState(undefined)).toEqual(DEFAULT_STATE);
  });

  it('safely normalizes valid partial data', () => {
    const raw = {
      profile: { displayName: 'Alex' },
      overallXp: 150,
      categories: [
        { id: 'c1', name: 'Work', icon: 'Briefcase', xp: 150 },
      ],
      quests: [
        { id: 'q1', title: 'Code MVP', categoryId: 'c1', xpReward: 50, repeatable: false, status: 'active' },
      ],
      streak: { currentStreak: 3, longestStreak: 5, lastActiveDate: '2026-09-08' },
    };

    const normalized = normalizeState(raw);
    expect(normalized.profile?.displayName).toBe('Alex');
    expect(normalized.overallXp).toBe(150);
    expect(normalized.categories).toHaveLength(1);
    expect(normalized.categories[0].name).toBe('Work');
    expect(normalized.quests).toHaveLength(1);
    expect(normalized.quests[0].title).toBe('Code MVP');
    expect(normalized.streak.currentStreak).toBe(3);
  });

  it('handles malformed numbers, missing fields, and unknown fields gracefully', () => {
    const malformed = {
      profile: { displayName: '   ' }, // blank name
      overallXp: 'not-a-number',
      categories: [
        null,
        { id: 'c1', name: 'Valid' },
        { missingId: true },
      ],
      quests: [
        'not an object',
        { id: 'q1', title: 'Task', xpReward: -50 }, // negative XP clamped to at least 1
      ],
      unknownField: 'ignore me',
    };

    const normalized = normalizeState(malformed);
    expect(normalized.profile?.displayName).toBe('Hero');
    expect(normalized.overallXp).toBe(0);
    expect(normalized.categories).toHaveLength(1);
    expect(normalized.categories[0].id).toBe('c1');
    expect(normalized.quests).toHaveLength(1);
    expect(normalized.quests[0].xpReward).toBe(1); // clamped
  });
});
