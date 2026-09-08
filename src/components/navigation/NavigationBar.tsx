import React from 'react';
import { NavigationTab } from '../../types';
import { BarChart3, CheckSquare, Home, Settings, Trophy } from 'lucide-react';
import { getPinClass } from '../../utils/stickyTheme';

interface NavigationBarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  activeQuestCount?: number;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentTab,
  onSelectTab,
  activeQuestCount = 0,
}) => {
  const tabs = [
    {
      id: 'home' as const,
      label: 'Board',
      icon: Home,
      color: 'bg-[#fef9c3] text-stone-900 border-[#fde047]',
      pin: 'red' as const,
    },
    {
      id: 'quests' as const,
      label: 'Quests',
      icon: CheckSquare,
      badge: activeQuestCount > 0 ? activeQuestCount : undefined,
      color: 'bg-[#dcfce7] text-stone-900 border-[#bbf7d0]',
      pin: 'blue' as const,
    },
    {
      id: 'stats' as const,
      label: 'Stats',
      icon: BarChart3,
      color: 'bg-[#e0f2fe] text-stone-900 border-[#bae6fd]',
      pin: 'yellow' as const,
    },
    {
      id: 'achievements' as const,
      label: 'Badges',
      icon: Trophy,
      color: 'bg-[#ffe4e6] text-stone-900 border-[#fecdd3]',
      pin: 'green' as const,
    },
    {
      id: 'settings' as const,
      label: 'Desk',
      icon: Settings,
      color: 'bg-[#ffedd5] text-stone-900 border-[#fed7aa]',
      pin: 'brass' as const,
    },
  ];

  return (
    <>
      {/* Desktop & Tablet Navigation Rail (Styled like wooden board molding with sticky tabs) */}
      <header className="hidden sm:block wood-shelf border-b-4 border-[#3d2412] sticky top-0 z-40 shadow-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo / Brand as Brass Plaque */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-400 border-2 border-amber-600 flex items-center justify-center text-stone-950 font-bold shadow-md">
              📌
            </div>
            <div>
              <span className="font-handwriting font-bold text-amber-100 text-xl tracking-wide drop-shadow-sm">
                LifePoint Board
              </span>
              <span className="text-[10px] text-amber-200/70 block -mt-1 font-body">
                Turn real life into progress
              </span>
            </div>
          </div>

          {/* Sticky Note Tabs */}
          <nav className="flex items-end gap-2 pt-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  id={`nav-desktop-${tab.id}`}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl text-xs font-bold font-handwriting text-base transition-all relative cursor-pointer border-t-2 border-x-2 ${
                    tab.color
                  } ${
                    isActive
                      ? 'translate-y-0 shadow-lg scale-105 z-10'
                      : 'translate-y-1.5 opacity-80 hover:translate-y-0.5 hover:opacity-100'
                  } focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-hidden`}
                >
                  {/* Mini Pushpin on active tab */}
                  {isActive && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                      <div className={`w-2.5 h-2.5 rounded-full ${getPinClass(tab.pin)}`} />
                    </div>
                  )}

                  <Icon size={16} strokeWidth={2.5} />
                  <span>{tab.label}</span>
                  {typeof tab.badge === 'number' && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-stone-900 text-amber-200">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Wooden desk rail with mini sticky tabs) */}
      <nav
        aria-label="Mobile Navigation"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 wood-shelf border-t-4 border-[#3d2412] px-2 py-1 shadow-2xl"
      >
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                id={`nav-mobile-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all relative min-w-[54px] border ${
                  tab.color
                } ${
                  isActive
                    ? 'scale-105 -translate-y-1 shadow-md font-bold'
                    : 'opacity-75 hover:opacity-100'
                } focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-hidden`}
              >
                {isActive && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <div className={`w-2 h-2 rounded-full ${getPinClass(tab.pin)}`} />
                  </div>
                )}
                <div className="relative">
                  <Icon size={18} strokeWidth={2.5} />
                  {typeof tab.badge === 'number' && (
                    <span className="absolute -top-1.5 -right-2 px-1 rounded-full text-[8px] font-mono font-bold bg-stone-900 text-amber-200">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-handwriting font-bold tracking-tight mt-0.5">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
