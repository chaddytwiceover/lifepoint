import React from 'react';
import * as LucideIcons from 'lucide-react';

export type IconName = string;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  className?: string;
}

export const AVAILABLE_ICONS = [
  'Activity',
  'Apple',
  'Award',
  'BookOpen',
  'Bookmark',
  'Briefcase',
  'CalendarCheck',
  'CheckCircle2',
  'Clock',
  'Code',
  'Coins',
  'Compass',
  'Crown',
  'Dumbbell',
  'Flame',
  'FolderGit2',
  'FolderPlus',
  'Footprints',
  'GraduationCap',
  'Heart',
  'HeartHandshake',
  'Layers',
  'Lightbulb',
  'Moon',
  'Music',
  'Palette',
  'PenTool',
  'Rocket',
  'Send',
  'ShieldCheck',
  'Sparkles',
  'Star',
  'Sun',
  'Sword',
  'Tag',
  'Target',
  'TrendingUp',
  'Trophy',
  'Users',
  'Zap',
];

export const Icon: React.FC<IconProps> = ({ name, size = 18, className = '', ...props }) => {
  // Try to find the icon from Lucide
  const IconComponent = (LucideIcons as Record<string, any>)[name] || LucideIcons.Sparkles;
  return <IconComponent size={size} className={className} {...props} />;
};
