import { describe, expect, it } from 'vitest';
import {
  calculateLevelProgress,
  cumulativeXpForLevel,
  didLevelUp,
  xpRequiredForNextLevel,
} from './leveling';

describe('Leveling Domain Logic', () => {
  it('calculates XP required for next level correctly using formula 100 + ((level - 1) * 50)', () => {
    expect(xpRequiredForNextLevel(1)).toBe(100);
    expect(xpRequiredForNextLevel(2)).toBe(150);
    expect(xpRequiredForNextLevel(3)).toBe(200);
    expect(xpRequiredForNextLevel(4)).toBe(250);
    expect(xpRequiredForNextLevel(5)).toBe(300);
  });

  it('calculates cumulative level thresholds correctly', () => {
    expect(cumulativeXpForLevel(1)).toBe(0);
    expect(cumulativeXpForLevel(2)).toBe(100);
    expect(cumulativeXpForLevel(3)).toBe(250);
    expect(cumulativeXpForLevel(4)).toBe(450);
    expect(cumulativeXpForLevel(5)).toBe(700);
    expect(cumulativeXpForLevel(6)).toBe(1000);
  });

  it('determines current level and progress within the current level', () => {
    // 0 XP -> Level 1, 0/100 XP, 0%
    const p0 = calculateLevelProgress(0);
    expect(p0.currentLevel).toBe(1);
    expect(p0.xpInCurrentLevel).toBe(0);
    expect(p0.xpRequiredForNextLevel).toBe(100);
    expect(p0.progressPercent).toBe(0);

    // 50 XP -> Level 1, 50/100 XP, 50%
    const p50 = calculateLevelProgress(50);
    expect(p50.currentLevel).toBe(1);
    expect(p50.xpInCurrentLevel).toBe(50);
    expect(p50.xpRequiredForNextLevel).toBe(100);
    expect(p50.progressPercent).toBe(50);

    // 100 XP -> Level 2, 0/150 XP, 0%
    const p100 = calculateLevelProgress(100);
    expect(p100.currentLevel).toBe(2);
    expect(p100.xpInCurrentLevel).toBe(0);
    expect(p100.xpRequiredForNextLevel).toBe(150);
    expect(p100.progressPercent).toBe(0);

    // 560 XP -> Level 4, 110/250 XP (since L4 starts at 450, 560-450=110), 44%
    const p560 = calculateLevelProgress(560);
    expect(p560.currentLevel).toBe(4);
    expect(p560.xpInCurrentLevel).toBe(110);
    expect(p560.xpRequiredForNextLevel).toBe(250);
    expect(p560.progressPercent).toBe(44);
  });

  it('detects single level-up properly', () => {
    const res = didLevelUp(90, 110);
    expect(res.leveledUp).toBe(true);
    expect(res.oldLevel).toBe(1);
    expect(res.newLevel).toBe(2);
    expect(res.levelsGained).toBe(1);
  });

  it('detects multiple levels gained from one large XP award', () => {
    // From 0 to 500 XP:
    // L1 = 0, L2 = 100, L3 = 250, L4 = 450. 500 XP puts player at Level 4 (with 50/250 XP towards L5)
    const res = didLevelUp(0, 500);
    expect(res.leveledUp).toBe(true);
    expect(res.oldLevel).toBe(1);
    expect(res.newLevel).toBe(4);
    expect(res.levelsGained).toBe(3);
  });

  it('identifies when no level-up occurred', () => {
    const res = didLevelUp(10, 40);
    expect(res.leveledUp).toBe(false);
    expect(res.oldLevel).toBe(1);
    expect(res.newLevel).toBe(1);
    expect(res.levelsGained).toBe(0);
  });

  it('category leveling and overall leveling work independently using the same utility', () => {
    const categoryXp = 120; // Level 2 (100 threshold)
    const overallXp = 460;  // Level 4 (450 threshold)

    const catProgress = calculateLevelProgress(categoryXp);
    const playerProgress = calculateLevelProgress(overallXp);

    expect(catProgress.currentLevel).toBe(2);
    expect(playerProgress.currentLevel).toBe(4);
  });
});
