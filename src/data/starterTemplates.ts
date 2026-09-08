import { StarterTemplate } from '../types';

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: 'student',
    name: 'Student',
    description: 'Optimize coursework, study habits, reading, and mental wellness.',
    categories: [
      { name: 'Study', icon: 'BookOpen', description: 'Exam preparation, homework, and focused study blocks' },
      { name: 'Classes', icon: 'GraduationCap', description: 'Lectures, labs, seminars, and attendance' },
      { name: 'Reading', icon: 'Bookmark', description: 'Textbooks, research papers, and assigned literature' },
      { name: 'Health', icon: 'Heart', description: 'Sleep, hydration, and study-break balance' },
    ],
  },
  {
    id: 'creator',
    name: 'Creator',
    description: 'Design, build, ship projects, learn skills, and grow your audience.',
    categories: [
      { name: 'Projects', icon: 'FolderGit2', description: 'Shipping builds, writing scripts, and creative outputs' },
      { name: 'Learning', icon: 'Sparkles', description: 'Techniques, tools, tutorials, and deep exploration' },
      { name: 'Publishing', icon: 'Send', description: 'Releasing videos, articles, art, and updates' },
      { name: 'Networking', icon: 'Users', description: 'Collaborating, connecting with peers, and community' },
    ],
  },
  {
    id: 'fitness',
    name: 'Fitness',
    description: 'Build physical discipline across training, endurance, food, and rest.',
    categories: [
      { name: 'Strength', icon: 'Dumbbell', description: 'Weight training, calisthenics, and resistance work' },
      { name: 'Cardio', icon: 'Footprints', description: 'Running, cycling, swimming, and aerobic conditioning' },
      { name: 'Nutrition', icon: 'Apple', description: 'Meal prep, macro goals, and mindful fueling' },
      { name: 'Recovery', icon: 'Moon', description: 'Stretching, sleep quality, and active rest' },
    ],
  },
  {
    id: 'growth',
    name: 'Personal Growth',
    description: 'Holistic improvement across well-being, intellect, finances, and bonds.',
    categories: [
      { name: 'Health', icon: 'Activity', description: 'Daily vitality, mental peace, and routine habits' },
      { name: 'Learning', icon: 'Compass', description: 'Books, new skills, languages, and curiosity' },
      { name: 'Money', icon: 'Coins', description: 'Budgeting, investing, saving, and financial discipline' },
      { name: 'Relationships', icon: 'HeartHandshake', description: 'Family, friendships, gratitude, and deep connections' },
    ],
  },
  {
    id: 'blank',
    name: 'Start Blank',
    description: 'Zero preset categories. Build your personal system completely from scratch.',
    categories: [],
  },
];
