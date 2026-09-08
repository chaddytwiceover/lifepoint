import React, { useState } from 'react';
import { LifePointProvider, useLifePoint } from './context/LifePointContext';
import { Onboarding } from './components/onboarding/Onboarding';
import { NavigationBar } from './components/navigation/NavigationBar';
import { ToastCelebration } from './components/common/ToastCelebration';
import { HomePage } from './pages/HomePage';
import { QuestsPage } from './pages/QuestsPage';
import { StatsPage } from './pages/StatsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { SettingsPage } from './pages/SettingsPage';
import { QuestModal } from './components/quests/QuestModal';
import { CategoryModal } from './components/categories/CategoryModal';
import { CategoryDetailModal } from './components/categories/CategoryDetailModal';
import { DeleteCategoryModal } from './components/categories/DeleteCategoryModal';
import { Modal } from './components/common/Modal';
import { Category, NavigationTab, Quest } from './types';

function MainApp() {
  const {
    state,
    isOnboarded,
    toasts,
    dismissToast,
    createQuest,
    updateQuest,
    deleteQuest,
    completeQuest,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useLifePoint();

  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');

  const [deletingQuestId, setDeletingQuestId] = useState<string | null>(null);

  // Modal States
  const [questModalOpen, setQuestModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [defaultQuestCategoryId, setDefaultQuestCategoryId] = useState<string | undefined>();

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [detailCategory, setDetailCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // If user has not onboarded yet, show onboarding
  if (!isOnboarded) {
    return <Onboarding />;
  }

  // Handlers for Quests
  const handleOpenCreateQuest = (categoryId?: string) => {
    setEditingQuest(null);
    setDefaultQuestCategoryId(categoryId);
    setQuestModalOpen(true);
  };

  const handleEditQuest = (quest: Quest) => {
    setEditingQuest(quest);
    setQuestModalOpen(true);
  };

  const handleQuestSubmit = (data: {
    id?: string;
    title: string;
    description?: string;
    categoryId: string;
    xpReward: number;
    repeatable: boolean;
  }) => {
    if (data.id) {
      const existing = state.quests.find((q) => q.id === data.id);
      if (existing) {
        updateQuest({
          ...existing,
          title: data.title,
          description: data.description,
          categoryId: data.categoryId,
          xpReward: data.xpReward,
          repeatable: data.repeatable,
        });
      }
    } else {
      createQuest({
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        xpReward: data.xpReward,
        repeatable: data.repeatable,
      });
    }
  };

  // Handlers for Categories
  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    setCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryModalOpen(true);
  };

  const handleCategorySubmit = (data: {
    id?: string;
    name: string;
    icon: string;
    description?: string;
  }) => {
    if (data.id) {
      const existing = state.categories.find((c) => c.id === data.id);
      if (existing) {
        updateCategory({
          ...existing,
          name: data.name,
          icon: data.icon,
          description: data.description,
        });
      }
    } else {
      createCategory({
        name: data.name,
        icon: data.icon,
        description: data.description,
      });
    }
  };

  const handleDeleteCategoryConfirm = (questHandling: 'delete' | 'unassign') => {
    if (!deletingCategory) return;
    deleteCategory(deletingCategory.id, questHandling);
    if (detailCategory?.id === deletingCategory.id) {
      setDetailCategory(null);
    }
    setDeletingCategory(null);
  };

  const activeQuestCount = state.quests.filter((q) => q.status === 'active').length;

  return (
    <div className="min-h-screen room-wall-bg text-stone-900 flex flex-col selection:bg-amber-400 selection:text-stone-950 font-body">
      {/* Toast Celebration & Milestones */}
      <ToastCelebration toasts={toasts} onDismiss={dismissToast} />

      {/* Navigation Header (Desktop / Tablet) & Bottom Bar (Mobile) */}
      <NavigationBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeQuestCount={activeQuestCount}
      />

      {/* Room Wall Centerpiece: Framed Corkboard */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-6 pt-4 sm:pt-6 pb-24 sm:pb-16">
        <div className="corkboard-surface border-6 sm:border-10 md:border-12 border-[#5c371a] rounded-3xl p-3 sm:p-6 md:p-8 shadow-2xl relative min-h-[700px]">
          {/* Wall Hanging Mount Brackets */}
          <div className="absolute -top-3 sm:-top-4 left-8 sm:left-14 w-6 h-5 bg-[#3a2210] rounded-t-md border-t-2 border-x-2 border-[#6d4420] shadow-md flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-amber-200/50" />
          </div>
          <div className="absolute -top-3 sm:-top-4 right-8 sm:right-14 w-6 h-5 bg-[#3a2210] rounded-t-md border-t-2 border-x-2 border-[#6d4420] shadow-md flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-amber-200/50" />
          </div>

          {/* Active Tab View Pinned on Board */}
          {currentTab === 'home' && (
            <HomePage
              onOpenCreateQuest={handleOpenCreateQuest}
              onOpenCreateCategory={handleOpenCreateCategory}
              onOpenCategoryDetail={(cat) => setDetailCategory(cat)}
              onEditQuest={handleEditQuest}
              onDeleteQuest={setDeletingQuestId}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'quests' && (
            <QuestsPage
              onOpenCreateQuest={handleOpenCreateQuest}
              onEditQuest={handleEditQuest}
              onDeleteQuest={setDeletingQuestId}
            />
          )}

          {currentTab === 'stats' && (
            <StatsPage
              onOpenCreateCategory={handleOpenCreateCategory}
              onOpenCategoryDetail={(cat) => setDetailCategory(cat)}
              onEditCategory={handleEditCategory}
              onDeleteCategory={(cat) => setDeletingCategory(cat)}
            />
          )}

          {currentTab === 'achievements' && <AchievementsPage />}

          {currentTab === 'settings' && <SettingsPage />}

          {/* Bottom Wooden Pin Ledge / Chalk Tray on the Corkboard Frame */}
          <div className="mt-8 -mx-3 sm:-mx-6 md:-mx-8 -mb-3 sm:-mb-6 md:-mb-8 wood-shelf h-5 rounded-b-2xl border-t-2 border-[#3d2412] shadow-md flex items-center justify-between px-6 text-[10px] text-amber-200/60 font-handwriting select-none">
            <span>📌 LifePoint Pinboard</span>
            <span>Room Bulletin</span>
          </div>
        </div>
      </main>

      <Modal isOpen={Boolean(deletingQuestId)} onClose={() => setDeletingQuestId(null)} title="Delete quest?" description="This removes the quest from your board. XP already earned is kept." maxWidth="sm">
        <p className="mb-5 font-medium break-words">{state.quests.find(q => q.id === deletingQuestId)?.title}</p>
        <div className="flex justify-end gap-3">
          <button type="button" className="px-4 py-2 rounded-xl border border-stone-300" onClick={() => setDeletingQuestId(null)}>Keep quest</button>
          <button type="button" className="px-4 py-2 rounded-xl bg-rose-700 text-white" onClick={() => { if (deletingQuestId) deleteQuest(deletingQuestId); setDeletingQuestId(null); }}>Delete quest</button>
        </div>
      </Modal>

      {/* Quest Create/Edit Modal */}
      <QuestModal
        isOpen={questModalOpen}
        onClose={() => setQuestModalOpen(false)}
        onSubmit={handleQuestSubmit}
        categories={state.categories}
        initialQuest={editingQuest}
        defaultCategoryId={defaultQuestCategoryId}
      />

      {/* Category Create/Edit Modal */}
      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={handleCategorySubmit}
        initialCategory={editingCategory}
      />

      {/* Category Detail Modal */}
      <CategoryDetailModal
        isOpen={Boolean(detailCategory)}
        onClose={() => setDetailCategory(null)}
        category={detailCategory ? state.categories.find((c) => c.id === detailCategory.id) || null : null}
        quests={state.quests}
        onEditCategory={(cat) => {
          setDetailCategory(null);
          handleEditCategory(cat);
        }}
        onDeleteCategory={(cat) => {
          setDetailCategory(null);
          setDeletingCategory(cat);
        }}
        onAddQuestForCategory={(catId) => handleOpenCreateQuest(catId)}
        onCompleteQuest={completeQuest}
        onEditQuest={(quest) => {
          setDetailCategory(null);
          handleEditQuest(quest);
        }}
        onDeleteQuest={setDeletingQuestId}
      />

      {/* Delete Category Confirmation Modal */}
      <DeleteCategoryModal
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        category={deletingCategory}
        questCount={
          deletingCategory
            ? state.quests.filter((q) => q.categoryId === deletingCategory.id).length
            : 0
        }
        onConfirm={handleDeleteCategoryConfirm}
      />
    </div>
  );
}

export default function App() {
  return (
    <LifePointProvider>
      <MainApp />
    </LifePointProvider>
  );
}
