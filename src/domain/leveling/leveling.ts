export type LevelProgress = {
  currentLevel: number;
  xpInCurrentLevel: number;
  xpRequiredForNextLevel: number;
  progressPercent: number; // 0 - 100
  cumulativeXpForCurrentLevel: number;
  cumulativeXpForNextLevel: number;
  totalXp: number;
};

export type LevelUpResult = {
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  levelsGained: number;
};

/**
 * Calculates XP required to progress from the given level to the next level.
 * Formula: 100 + ((level - 1) * 50)
 */
export function xpRequiredForNextLevel(level: number): number {
  const safeLevel = Math.max(1, Math.floor(level));
  return 100 + (safeLevel - 1) * 50;
}

/**
 * Cumulative XP required to reach the given level from Level 1.
 * Level 1 = 0
 * Level 2 = 100
 * Level 3 = 250
 * Level 4 = 450
 * Level 5 = 700
 */
export function cumulativeXpForLevel(level: number): number {
  const safeLevel = Math.max(1, Math.floor(level));
  if (safeLevel === 1) return 0;
  // Sum from k=1 to safeLevel - 1 of (100 + (k-1)*50)
  // = 100*(L-1) + 25*(L-1)*(L-2)
  const n = safeLevel - 1;
  return 100 * n + 25 * n * (n - 1);
}

/**
 * Calculates current level and progress details from total XP.
 */
export function calculateLevelProgress(totalXp: number): LevelProgress {
  const safeXp = Math.max(0, Math.floor(totalXp || 0));

  let level = 1;
  let cumulative = 0;

  // Find current level by incrementing while XP reaches or exceeds cumulative required for next level
  while (true) {
    const nextReq = xpRequiredForNextLevel(level);
    if (safeXp < cumulative + nextReq) {
      break;
    }
    cumulative += nextReq;
    level += 1;
  }

  const xpInCurrentLevel = safeXp - cumulative;
  const nextLevelRequirement = xpRequiredForNextLevel(level);
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((xpInCurrentLevel / nextLevelRequirement) * 1000) / 10)
  );

  return {
    currentLevel: level,
    xpInCurrentLevel,
    xpRequiredForNextLevel: nextLevelRequirement,
    progressPercent,
    cumulativeXpForCurrentLevel: cumulative,
    cumulativeXpForNextLevel: cumulative + nextLevelRequirement,
    totalXp: safeXp,
  };
}

/**
 * Determines whether a level-up occurred after an XP award.
 */
export function didLevelUp(previousXp: number, newXp: number): LevelUpResult {
  const oldProgress = calculateLevelProgress(previousXp);
  const newProgress = calculateLevelProgress(newXp);
  const levelsGained = Math.max(0, newProgress.currentLevel - oldProgress.currentLevel);

  return {
    leveledUp: levelsGained > 0,
    oldLevel: oldProgress.currentLevel,
    newLevel: newProgress.currentLevel,
    levelsGained,
  };
}
