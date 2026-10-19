import {
  AppSettings,
  LoggedMeal,
  WeightRecord,
  WorkoutHistoryEntry,
  CommunityPost,
  ReminderSetting,
} from '../types';
import { UserProfile } from './fitness';

const STORAGE_KEYS = {
  PROFILE: 'bugarku_user_profile',
  SETTINGS: 'bugarku_app_settings',
  MEALS: 'bugarku_logged_meals',
  WATER: 'bugarku_water_logged_ml',
  WORKOUTS: 'bugarku_workout_history',
  WEIGHTS: 'bugarku_weight_records',
  COMMUNITY: 'bugarku_community_posts',
  REMINDERS: 'bugarku_reminders',
  LAST_SYNC: 'bugarku_last_cloud_sync',
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  gender: 'male',
  age: 26,
  weightKg: 68,
  heightCm: 172,
  activityLevel: 'moderate',
  goal: 'maintain',
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  isDarkMode: false,
  accentColor: 'emerald',
  notificationsEnabled: true,
  autoSyncCloud: true,
  soundEffects: true,
  hapticFeedback: true,
  offlineModeActive: false,
};

export const DEFAULT_REMINDERS: ReminderSetting[] = [
  {
    id: 'rem-1',
    title: 'Sesi Latihan Pagi',
    time: '06:30',
    enabled: true,
    type: 'latihan',
    message: 'Semangat pagi! Awali hari dengan 15 menit peregangan atau kardio.',
    days: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
  },
  {
    id: 'rem-2',
    title: 'Ingat Minum Air',
    time: '11:00',
    enabled: true,
    type: 'air',
    message: 'Sudah minum air putih siang ini? Tetap terhidrasi untuk metabolisme optimal!',
    days: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
  },
  {
    id: 'rem-3',
    title: 'Latihan Pembakar Sore',
    time: '17:15',
    enabled: true,
    type: 'latihan',
    message: 'Lepaskan stres hari ini dengan 20 menit sesi latihan tubuh!',
    days: ['Sen', 'Rab', 'Jum'],
  },
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'Rian Pratama',
    authorTitle: 'Pegiat Lari & Kardio',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rian',
    category: 'Pencapaian',
    content: 'Alhamdulillah genap streak 7 hari! Tubuh terasa jauh lebih segar dan tidur malam jadi nyenyak banget. Kuncinya konsisten 15 menit setiap pagi daripada langsung berat tapi putus di tengah jalan. Semangat semuanya!',
    workoutSummary: {
      exerciseName: 'Jumping Jacks & Push-Up Sesi Cepat',
      durationMin: 20,
      caloriesBurned: 145,
    },
    likesCount: 24,
    hasLiked: false,
    comments: [
      {
        id: 'c-1',
        authorName: 'Coach Dian',
        content: 'Mantap mas Rian! Konsistensi mikro memang kunci pembentukan habit abadi.',
        createdAt: '1 jam yang lalu',
      },
      {
        id: 'c-2',
        authorName: 'Siti Rahma',
        content: 'Keren banget, besok giliran saya kejar streak 7 hari!',
        createdAt: '30 menit yang lalu',
      },
    ],
    createdAt: '2 jam yang lalu',
  },
  {
    id: 'post-2',
    authorName: 'Dr. Sarah Nurhaliza',
    authorTitle: 'Nutrisionis Olahraga',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    category: 'Menu Sehat',
    content: 'Tips nutrisi hari ini: Jangan takut makan tempe saat proses pembentukan otot. 100g tempe mengandung sekitar 19g protein nabati lengkap, probiotik fermentasi yang menyehatkan usus, dan harga yang sangat bersahabat! Padukan dengan sayur bayam bening dan karbohidrat kompleks seperti nasi merah.',
    likesCount: 42,
    hasLiked: true,
    comments: [
      {
        id: 'c-3',
        authorName: 'Budi Santoso',
        content: 'Saya ganti makan siang dengan tempe panggang + quinoa sesuai resep BugarKu, kenyangnya tahan lama dok!',
        createdAt: '3 jam yang lalu',
      },
    ],
    createdAt: '4 jam yang lalu',
  },
  {
    id: 'post-3',
    authorName: 'Arif Wibowo',
    authorTitle: 'Pemula Bugar 2026',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arif',
    category: 'Motivasi',
    content: 'Bagi teman-teman yang baru mulai berolahraga dari berat badan berlebih: tidak apa-apa kalau cuma bisa push-up bertumpu di lutut atau squat perlahan. Yang penting bergerak setiap hari! Grafik progres di aplikasi ini benar-benar membantu saya melihat penurunan lingkar pinggang dari minggu ke minggu.',
    likesCount: 56,
    hasLiked: false,
    comments: [],
    createdAt: '6 jam yang lalu',
  },
];

export const INITIAL_WEIGHT_HISTORY: WeightRecord[] = [
  { date: '2026-10-01', weightKg: 70.2, waistCm: 84, bodyFatPct: 22.4 },
  { date: '2026-10-05', weightKg: 69.8, waistCm: 83.5, bodyFatPct: 22.0 },
  { date: '2026-10-10', weightKg: 69.2, waistCm: 82.8, bodyFatPct: 21.6 },
  { date: '2026-10-14', weightKg: 68.6, waistCm: 82.0, bodyFatPct: 21.2 },
  { date: '2026-10-18', weightKg: 68.0, waistCm: 81.4, bodyFatPct: 20.8 },
];

export const INITIAL_WORKOUT_HISTORY: WorkoutHistoryEntry[] = [
  {
    id: 'w-1',
    exerciseId: 'jumping-jacks',
    exerciseName: 'Jumping Jacks',
    durationSec: 180,
    caloriesBurned: 72,
    completedAt: '2026-10-17T07:15:00.000Z',
    avgHeartRate: 138,
  },
  {
    id: 'w-2',
    exerciseId: 'push-ups',
    exerciseName: 'Push-Up Standar',
    durationSec: 240,
    caloriesBurned: 88,
    completedAt: '2026-10-17T07:22:00.000Z',
    avgHeartRate: 142,
  },
  {
    id: 'w-3',
    exerciseId: 'bodyweight-squats',
    exerciseName: 'Squat Beban Tubuh',
    durationSec: 300,
    caloriesBurned: 110,
    completedAt: '2026-10-18T07:10:00.000Z',
    avgHeartRate: 146,
  },
  {
    id: 'w-4',
    exerciseId: 'static-plank',
    exerciseName: 'Plank Statis',
    durationSec: 180,
    caloriesBurned: 60,
    completedAt: '2026-10-18T07:18:00.000Z',
    avgHeartRate: 124,
  },
];

export const StorageService = {
  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  },

  saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  getAppSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : DEFAULT_APP_SETTINGS;
    } catch {
      return DEFAULT_APP_SETTINGS;
    }
  },

  saveAppSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  getLoggedMeals(): LoggedMeal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEALS);
      return data ? JSON.parse(data) : [
        {
          id: 'meal-today-1',
          name: 'Smoothie Bowl Tropis Pisang & Chia Seed',
          mealType: 'Sarapan',
          calories: 310,
          proteinG: 14,
          carbsG: 52,
          fatG: 7,
          timestamp: new Date().toISOString(),
        },
      ];
    } catch {
      return [];
    }
  },

  saveLoggedMeals(meals: LoggedMeal[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  getWaterLoggedMl(): number {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WATER);
      return data ? parseInt(data, 10) : 1500;
    } catch {
      return 1500;
    }
  },

  saveWaterLoggedMl(ml: number): void {
    try {
      localStorage.setItem(STORAGE_KEYS.WATER, ml.toString());
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  getWorkoutHistory(): WorkoutHistoryEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
      return data ? JSON.parse(data) : INITIAL_WORKOUT_HISTORY;
    } catch {
      return INITIAL_WORKOUT_HISTORY;
    }
  },

  saveWorkoutHistory(workouts: WorkoutHistoryEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  getWeightRecords(): WeightRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WEIGHTS);
      return data ? JSON.parse(data) : INITIAL_WEIGHT_HISTORY;
    } catch {
      return INITIAL_WEIGHT_HISTORY;
    }
  },

  saveWeightRecords(records: WeightRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(records));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  getCommunityPosts(): CommunityPost[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMMUNITY);
      return data ? JSON.parse(data) : INITIAL_COMMUNITY_POSTS;
    } catch {
      return INITIAL_COMMUNITY_POSTS;
    }
  },

  saveCommunityPosts(posts: CommunityPost[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COMMUNITY, JSON.stringify(posts));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  getReminders(): ReminderSetting[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      return data ? JSON.parse(data) : DEFAULT_REMINDERS;
    } catch {
      return DEFAULT_REMINDERS;
    }
  },

  saveReminders(reminders: ReminderSetting[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  getLastCloudSync(): string {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || 'Baru saja';
  },

  recordCloudSync(): string {
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const fullDate = `${timeStr} WIB`;
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, fullDate);
    return fullDate;
  },

  exportAllDataJSON(): string {
    const backup = {
      profile: this.getUserProfile(),
      settings: this.getAppSettings(),
      meals: this.getLoggedMeals(),
      waterMl: this.getWaterLoggedMl(),
      workouts: this.getWorkoutHistory(),
      weights: this.getWeightRecords(),
      community: this.getCommunityPosts(),
      reminders: this.getReminders(),
      exportedAt: new Date().toISOString(),
      appVersion: '2.4.0',
    };
    return JSON.stringify(backup, null, 2);
  },

  importAllDataJSON(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) this.saveUserProfile(data.profile);
      if (data.settings) this.saveAppSettings(data.settings);
      if (data.meals) this.saveLoggedMeals(data.meals);
      if (typeof data.waterMl === 'number') this.saveWaterLoggedMl(data.waterMl);
      if (data.workouts) this.saveWorkoutHistory(data.workouts);
      if (data.weights) this.saveWeightRecords(data.weights);
      if (data.community) this.saveCommunityPosts(data.community);
      if (data.reminders) this.saveReminders(data.reminders);
      this.recordCloudSync();
      return true;
    } catch {
      return false;
    }
  },
};
