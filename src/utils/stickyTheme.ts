// Sticky note visual styles & paper palette generator
export type StickyColorName = 'yellow' | 'pink' | 'mint' | 'cyan' | 'lavender' | 'peach';

export interface StickyStyle {
  name: StickyColorName;
  bg: string;
  border: string;
  text: string;
  badgeBg: string;
  badgeText: string;
  pinType: 'red' | 'blue' | 'yellow' | 'green' | 'brass';
  angle: string; // CSS rotation degree or class
}

const STICKY_PALETTES: Record<StickyColorName, {
  bg: string;
  border: string;
  text: string;
  badgeBg: string;
  badgeText: string;
  pinType: 'red' | 'blue' | 'yellow' | 'green' | 'brass';
}> = {
  yellow: {
    bg: '#fef9c3', // pastel post-it yellow
    border: '#fde047',
    text: '#292524',
    badgeBg: '#fef08a',
    badgeText: '#713f12',
    pinType: 'red',
  },
  pink: {
    bg: '#ffe4e6', // pastel rose pink
    border: '#fecdd3',
    text: '#292524',
    badgeBg: '#fbcfe8',
    badgeText: '#831843',
    pinType: 'brass',
  },
  mint: {
    bg: '#dcfce7', // pastel green mint
    border: '#bbf7d0',
    text: '#292524',
    badgeBg: '#bbf7d0',
    badgeText: '#14532d',
    pinType: 'blue',
  },
  cyan: {
    bg: '#e0f2fe', // sky blue
    border: '#bae6fd',
    text: '#292524',
    badgeBg: '#bae6fd',
    badgeText: '#0c4a6e',
    pinType: 'yellow',
  },
  lavender: {
    bg: '#f3e8ff', // lilac purple
    border: '#e9d5ff',
    text: '#292524',
    badgeBg: '#e9d5ff',
    badgeText: '#581c87',
    pinType: 'green',
  },
  peach: {
    bg: '#ffedd5', // warm peach apricot
    border: '#fed7aa',
    text: '#292524',
    badgeBg: '#fed7aa',
    badgeText: '#7c2d12',
    pinType: 'red',
  },
};

const COLOR_KEYS: StickyColorName[] = ['yellow', 'mint', 'cyan', 'pink', 'lavender', 'peach'];

// Deterministic hash to assign consistent paper color & slight rotation to notes
export function getStickyStyle(id: string, index = 0): StickyStyle {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const colorIndex = Math.abs(hash + index) % COLOR_KEYS.length;
  const colorName = COLOR_KEYS[colorIndex];
  const palette = STICKY_PALETTES[colorName];

  // Natural subtle rotation (-2deg to +2deg)
  const angles = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2', '-rotate-1', 'rotate-0.5', '-rotate-1.5', 'rotate-1.5'];
  const angle = angles[Math.abs(hash * 3) % angles.length];

  return {
    name: colorName,
    ...palette,
    angle,
  };
}

export function getPinClass(pinType: 'red' | 'blue' | 'yellow' | 'green' | 'brass') {
  switch (pinType) {
    case 'red': return 'push-pin-red';
    case 'blue': return 'push-pin-blue';
    case 'yellow': return 'push-pin-yellow';
    case 'green': return 'push-pin-green';
    case 'brass': return 'push-pin-brass';
    default: return 'push-pin-red';
  }
}
