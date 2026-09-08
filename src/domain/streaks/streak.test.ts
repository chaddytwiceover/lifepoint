import { describe, expect, it } from 'vitest';
import {
  calculateStreakUpdate,
  getCalendarDaysDifference,
  getLocalDateString,
} from './streak';

describe('Streak Domain Logic', () => {
  it('formats dates to local YYYY-MM-DD string correctly', () => {
    const d = new Date(2026, 8, 8); // Sept 8, 2026
    expect(getLocalDateString(d)).toBe('2026-09-08');
  });

  it('calculates calendar days difference accurately across dates', () => {
    expect(getCalendarDaysDifference('2026-09-08', '2026-09-08')).toBe(0);
    expect(getCalendarDaysDifference('2026-09-08', '2026-09-09')).toBe(1);
    expect(getCalendarDaysDifference('2026-09-08', '2026-09-10')).toBe(2);
    expect(getCalendarDaysDifference('2026-09-01', '2026-09-08')).toBe(7);
  });

  it('initializes streak to 1 on first ever quest completion', () => {
    const initial = { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
    const updated = calculateStreakUpdate(initial, '2026-09-08');

    expect(updated.currentStreak).toBe(1);
    expect(updated.longestStreak).toBe(1);
    expect(updated.lastActiveDate).toBe('2026-09-08');
  });

  it('maintains the same streak when completing multiple quests on the same calendar day', () => {
    const initial = { currentStreak: 3, longestStreak: 5, lastActiveDate: '2026-09-08' };
    const updated = calculateStreakUpdate(initial, '2026-09-08');

    expect(updated.currentStreak).toBe(3);
    expect(updated.longestStreak).toBe(5);
    expect(updated.lastActiveDate).toBe('2026-09-08');
  });

  it('increments streak by 1 on consecutive calendar day activity', () => {
    const initial = { currentStreak: 3, longestStreak: 3, lastActiveDate: '2026-09-08' };
    const updated = calculateStreakUpdate(initial, '2026-09-09');

    expect(updated.currentStreak).toBe(4);
    expect(updated.longestStreak).toBe(4);
    expect(updated.lastActiveDate).toBe('2026-09-09');
  });

  it('resets streak to 1 after missing one or more calendar days, but preserves longestStreak', () => {
    const initial = { currentStreak: 6, longestStreak: 10, lastActiveDate: '2026-09-06' };
    // Activity on 2026-09-08 means Sept 7 was missed (diff = 2)
    const updated = calculateStreakUpdate(initial, '2026-09-08');

    expect(updated.currentStreak).toBe(1);
    expect(updated.longestStreak).toBe(10);
    expect(updated.lastActiveDate).toBe('2026-09-08');
  });

  it('does not penalize repeatedly if user remains inactive', () => {
    const initial = { currentStreak: 1, longestStreak: 10, lastActiveDate: '2026-09-01' };
    const updated = calculateStreakUpdate(initial, '2026-09-10');

    expect(updated.currentStreak).toBe(1);
    expect(updated.longestStreak).toBe(10);
    expect(updated.lastActiveDate).toBe('2026-09-10');
  });
});
