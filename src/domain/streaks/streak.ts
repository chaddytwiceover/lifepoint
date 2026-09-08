import { StreakState } from '../../types';

/**
 * Formats a Date object into a YYYY-MM-DD local calendar date string.
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates the difference in whole calendar days from dateStrA to dateStrB (B - A).
 * Format expected: YYYY-MM-DD
 */
export function getCalendarDaysDifference(dateStrA: string, dateStrB: string): number {
  const [y1, m1, d1] = dateStrA.split('-').map(Number);
  const [y2, m2, d2] = dateStrB.split('-').map(Number);

  // UTC midday to eliminate Daylight Savings Time boundary issues
  const utc1 = Date.UTC(y1, m1 - 1, d1, 12, 0, 0);
  const utc2 = Date.UTC(y2, m2 - 1, d2, 12, 0, 0);

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.round((utc2 - utc1) / MS_PER_DAY);
}

/**
 * Updates the user's streak upon completing a quest.
 *
 * Rules:
 * - first active day -> streak becomes 1
 * - another quest on the same calendar day -> streak remains unchanged
 * - activity on the next calendar day -> streak + 1
 * - missing one or more calendar days -> next active day starts a new streak at 1
 */
export function calculateStreakUpdate(
  currentStreak: StreakState,
  currentDateOrString: Date | string = new Date()
): StreakState {
  const todayStr =
    typeof currentDateOrString === 'string'
      ? currentDateOrString
      : getLocalDateString(currentDateOrString);

  const { currentStreak: streak, longestStreak, lastActiveDate } = currentStreak;

  // First active day ever
  if (!lastActiveDate) {
    return {
      currentStreak: 1,
      longestStreak: Math.max(1, longestStreak),
      lastActiveDate: todayStr,
    };
  }

  const dayDiff = getCalendarDaysDifference(lastActiveDate, todayStr);

  if (dayDiff === 0) {
    // Another quest on the same calendar day -> streak remains unchanged
    return {
      currentStreak: Math.max(1, streak),
      longestStreak: Math.max(streak, longestStreak, 1),
      lastActiveDate: todayStr,
    };
  }

  if (dayDiff === 1) {
    // Activity on the next consecutive calendar day -> streak + 1
    const newStreak = streak + 1;
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, longestStreak),
      lastActiveDate: todayStr,
    };
  }

  // Missing one or more calendar days (dayDiff > 1 or clock skew dayDiff < 0)
  // Starts a new streak at 1
  return {
    currentStreak: 1,
    longestStreak: Math.max(1, longestStreak),
    lastActiveDate: todayStr,
  };
}
