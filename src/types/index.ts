export type NavigationTab = 
  | 'beranda'
  | 'olahraga'
  | 'nutrisi'
  | 'progres'
  | 'wearable'
  | 'komunitas'
  | 'pengaturan';

export type ExerciseDifficulty = 'Pemula' | 'Menengah' | 'Lanjutan';

export type ExerciseCategory = 
  | 'Semua'
  | 'Full Body'
  | 'Kardio'
  | 'Perut & Core'
  | 'Lengan & Bahu'
  | 'Kaki & Bokong'
  | 'Peregangan';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  durationSec: number;
  defaultReps?: number;
  caloriesBurned: number;
  primaryMuscle: string;
  secondaryMuscles: string[];
  animationKey: string;
  description: string;
  benefits: string[];
  steps: string[];
  breathingTip: string;
}

export interface MealRecipe {
  id: string;
  name: string;
  category: 'Sarapan' | 'Makan Siang' | 'Makan Malam' | 'Camilan Sehat';
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  prepTimeMin: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  healthBenefit: string;
  isVegetarian?: boolean;
}

export interface LoggedMeal {
  id: string;
  recipeId?: string;
  name: string;
  mealType: 'Sarapan' | 'Makan Siang' | 'Makan Malam' | 'Camilan';
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  timestamp: string;
}

export interface WeightRecord {
  date: string; // YYYY-MM-DD
  weightKg: number;
  waistCm?: number;
  bodyFatPct?: number;
}

export interface WorkoutHistoryEntry {
  id: string;
  exerciseId: string;
  exerciseName: string;
  durationSec: number;
  caloriesBurned: number;
  completedAt: string;
  avgHeartRate?: number;
}

export interface CommunityComment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorTitle: string;
  authorAvatar: string;
  category: 'Motivasi' | 'Tips Olahraga' | 'Menu Sehat' | 'Pencapaian';
  content: string;
  workoutSummary?: {
    exerciseName: string;
    durationMin: number;
    caloriesBurned: number;
  };
  likesCount: number;
  hasLiked: boolean;
  comments: CommunityComment[];
  createdAt: string;
}

export interface ReminderSetting {
  id: string;
  title: string;
  time: string; // HH:mm
  enabled: boolean;
  type: 'latihan' | 'air' | 'nutrisi';
  message: string;
  days: string[]; // ['Sen', 'Sel', ...]
}

export type ThemeAccent = 'emerald' | 'lime' | 'orange' | 'cyan' | 'violet';

export interface AppSettings {
  isDarkMode: boolean;
  accentColor: ThemeAccent;
  notificationsEnabled: boolean;
  autoSyncCloud: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  offlineModeActive: boolean;
}
