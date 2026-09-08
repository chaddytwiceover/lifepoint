import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  Category,
  LifePointState,
  Quest,
  StarterTemplateId,
  UserProfile,
} from '../types';
import { STARTER_TEMPLATES } from '../data/starterTemplates';
import { executeQuestCompletion, QuestCompletionReport } from '../domain/quests/questTransaction';
import { evaluateNewAchievements, ACHIEVEMENTS } from '../domain/achievements/achievements';
import { clearLifePointState, DEFAULT_STATE, loadLifePointState, saveLifePointState } from '../storage/storage';
import { CelebrationToast } from '../components/common/ToastCelebration';

interface LifePointContextType {
  state: LifePointState;
  isOnboarded: boolean;
  toasts: CelebrationToast[];
  dismissToast: (id: string) => void;
  initializeProfile: (displayName: string, templateId: StarterTemplateId) => void;
  updateProfile: (displayName: string) => void;
  completeQuest: (questId: string) => Promise<QuestCompletionReport | null>;
  createQuest: (questData: {
    title: string;
    description?: string;
    categoryId: string;
    xpReward: number;
    repeatable: boolean;
  }) => Quest;
  updateQuest: (quest: Quest) => void;
  deleteQuest: (questId: string) => void;
  createCategory: (categoryData: {
    name: string;
    icon: string;
    description?: string;
  }) => Category;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string, questHandling: 'delete' | 'unassign') => void;
  reorderCategories: (categories: Category[]) => void;
  resetAllData: () => void;
}

const LifePointContext = createContext<LifePointContextType | null>(null);

export const LifePointProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LifePointState>(() => {
    const saved = loadLifePointState();
    return saved || DEFAULT_STATE;
  });

  const [toasts, setToasts] = useState<CelebrationToast[]>([]);
  const completingRef = useRef<Set<string>>(new Set());

  // Save state whenever it changes
  useEffect(() => {
    saveLifePointState(state);
  }, [state]);

  const isOnboarded = Boolean(state.profile && state.profile.displayName);

  const addToast = (toast: Omit<CelebrationToast, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const initializeProfile = (displayName: string, templateId: StarterTemplateId) => {
    const trimmed = displayName.trim() || 'Adventurer';
    const profile: UserProfile = {
      displayName: trimmed,
      createdAt: Date.now(),
    };

    const template = STARTER_TEMPLATES.find((t) => t.id === templateId);
    const newCategories: Category[] = (template?.categories || []).map((cat, idx) => ({
      id: `cat_${Date.now()}_${idx}`,
      name: cat.name,
      icon: cat.icon,
      description: cat.description,
      xp: 0,
      createdAt: Date.now() + idx,
    }));

    // Evaluate "getting_started" and "explorer" achievements if applicable
    const unlockedAchievements: Record<string, number> = {};
    if (newCategories.length >= 1) {
      unlockedAchievements['getting_started'] = Date.now();
    }
    if (newCategories.length >= 5) {
      unlockedAchievements['explorer'] = Date.now();
    }

    const nextState: LifePointState = {
      ...DEFAULT_STATE,
      profile,
      categories: newCategories,
      unlockedAchievements,
    };

    setState(nextState);
  };

  const updateProfile = (displayName: string) => {
    const trimmed = displayName.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, displayName: trimmed } : { displayName: trimmed, createdAt: Date.now() },
    }));
  };

  const completeQuest = async (questId: string): Promise<QuestCompletionReport | null> => {
    // Prevent accidental double-tapping
    if (completingRef.current.has(questId)) {
      return null;
    }

    completingRef.current.add(questId);

    try {
      const result = executeQuestCompletion(state, questId);
      if (!result.success) {
        return null;
      }

      setState(result.nextState);

      const report = result.report;

      // Restrained feedback: XP toast
      addToast({
        type: 'xp',
        title: `Completed: ${report.quest.title}`,
        subtitle: `${report.categoryName}`,
        xp: report.xpAwarded,
      });

      // Category level up toast
      if (report.categoryLevelUp?.leveledUp) {
        addToast({
          type: 'level_up',
          title: `Category Level Up!`,
          subtitle: `${report.categoryLevelUp.categoryName} is now Level ${report.categoryLevelUp.newLevel}`,
        });
      }

      // Player level up toast
      if (report.playerLevelUp?.leveledUp) {
        addToast({
          type: 'player_level_up',
          title: `Player Level Up!`,
          subtitle: `You reached Player Level ${report.playerLevelUp.newLevel}!`,
        });
      }

      // Achievement toasts
      report.newAchievements.forEach((achId) => {
        const achMeta = ACHIEVEMENTS[achId];
        addToast({
          type: 'achievement',
          title: `Achievement: ${achMeta.title}`,
          subtitle: achMeta.description,
        });
      });

      return report;
    } finally {
      // Release double-tap lock after a brief debounce
      setTimeout(() => {
        completingRef.current.delete(questId);
      }, 500);
    }
  };

  const createQuest = (questData: {
    title: string;
    description?: string;
    categoryId: string;
    xpReward: number;
    repeatable: boolean;
  }): Quest => {
    const newQuest: Quest = {
      id: `quest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: questData.title.trim() || 'Untitled Quest',
      description: questData.description?.trim(),
      categoryId: questData.categoryId,
      xpReward: Math.max(1, Math.floor(questData.xpReward || 25)),
      repeatable: questData.repeatable,
      status: 'active',
      createdAt: Date.now(),
      completionCount: 0,
    };

    setState((prev) => ({
      ...prev,
      quests: [newQuest, ...prev.quests],
    }));

    return newQuest;
  };

  const updateQuest = (quest: Quest) => {
    setState((prev) => ({
      ...prev,
      quests: prev.quests.map((q) => (q.id === quest.id ? quest : q)),
    }));
  };

  const deleteQuest = (questId: string) => {
    setState((prev) => ({
      ...prev,
      quests: prev.quests.filter((q) => q.id !== questId),
    }));
  };

  const createCategory = (categoryData: {
    name: string;
    icon: string;
    description?: string;
  }): Category => {
    const newCategory: Category = {
      id: `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: categoryData.name.trim() || 'New Category',
      icon: categoryData.icon || 'Tag',
      description: categoryData.description?.trim(),
      xp: 0,
      createdAt: Date.now(),
    };

    setState((prev) => {
      const nextCategories = [...prev.categories, newCategory];

      // Check for category-based achievements: "getting_started", "explorer"
      const newlyUnlocked = evaluateNewAchievements({
        totalQuestsCompleted: prev.quests.filter((q) => q.status === 'completed' || q.completionCount > 0).length,
        categories: nextCategories,
        streak: prev.streak,
        overallXp: prev.overallXp,
        unlockedAchievements: prev.unlockedAchievements,
      });

      const nextAchievements = { ...prev.unlockedAchievements };
      newlyUnlocked.forEach((id) => {
        nextAchievements[id] = Date.now();
        const achMeta = ACHIEVEMENTS[id];
        addToast({
          type: 'achievement',
          title: `Achievement: ${achMeta.title}`,
          subtitle: achMeta.description,
        });
      });

      return {
        ...prev,
        categories: nextCategories,
        unlockedAchievements: nextAchievements,
      };
    });

    return newCategory;
  };

  const updateCategory = (category: Category) => {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === category.id ? category : c)),
    }));
  };

  const deleteCategory = (categoryId: string, questHandling: 'delete' | 'unassign') => {
    setState((prev) => {
      const nextCategories = prev.categories.filter((c) => c.id !== categoryId);
      let nextQuests = prev.quests;

      if (questHandling === 'delete') {
        nextQuests = prev.quests.filter((q) => q.categoryId !== categoryId);
      } else {
        nextQuests = prev.quests.map((q) =>
          q.categoryId === categoryId ? { ...q, categoryId: '' } : q
        );
      }

      return {
        ...prev,
        categories: nextCategories,
        quests: nextQuests,
      };
    });
  };

  const reorderCategories = (categories: Category[]) => {
    setState((prev) => ({
      ...prev,
      categories,
    }));
  };

  const resetAllData = () => {
    clearLifePointState();
    setState({ ...DEFAULT_STATE });
    setToasts([]);
  };

  return (
    <LifePointContext.Provider
      value={{
        state,
        isOnboarded,
        toasts,
        dismissToast,
        initializeProfile,
        updateProfile,
        completeQuest,
        createQuest,
        updateQuest,
        deleteQuest,
        createCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        resetAllData,
      }}
    >
      {children}
    </LifePointContext.Provider>
  );
};

export const useLifePoint = (): LifePointContextType => {
  const ctx = useContext(LifePointContext);
  if (!ctx) {
    throw new Error('useLifePoint must be used within a LifePointProvider');
  }
  return ctx;
};
