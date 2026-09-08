import React from 'react';

interface ProgressBarProps {
  progressPercent: number; // 0 - 100
  height?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'cyan' | 'amber' | 'violet';
  showLabel?: boolean;
  labelLeft?: string;
  labelRight?: string;
  className?: string;
  ariaLabel?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progressPercent,
  height = 'md',
  color = 'emerald',
  showLabel = false,
  labelLeft,
  labelRight,
  className = '',
  ariaLabel = 'Progress bar',
}) => {
  const clampedPercent = Math.min(100, Math.max(0, progressPercent));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }[height];

  const colorClasses = {
    emerald: 'bg-emerald-500 shadow-xs shadow-emerald-500/30',
    cyan: 'bg-cyan-500 shadow-xs shadow-cyan-500/30',
    amber: 'bg-amber-500 shadow-xs shadow-amber-500/30',
    violet: 'bg-violet-500 shadow-xs shadow-violet-500/30',
  }[color];

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (labelLeft || labelRight) && (
        <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5 font-medium">
          {labelLeft && <span>{labelLeft}</span>}
          {labelRight && <span className="font-mono">{labelRight}</span>}
        </div>
      )}
      <div
        className={`w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/60`}
        role="progressbar"
        aria-valuenow={Math.round(clampedPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
      >
        <div
          className={`${heightClasses} ${colorClasses} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
    </div>
  );
};
