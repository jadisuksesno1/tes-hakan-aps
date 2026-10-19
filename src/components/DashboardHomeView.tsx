import React from 'react';
import {
  Flame,
  Clock,
  Heart,
  Utensils,
  Play,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Droplets,
  Calendar,
} from 'lucide-react';
import { Exercise, MealRecipe, NavigationTab } from '../types';
import { EXERCISES_DATA } from '../data/exercises';
import { HEALTHY_MEALS_DATA } from '../data/meals';
import { UserProfile } from '../utils/fitness';

interface DashboardHomeViewProps {
  onNavigateTab: (tab: NavigationTab) => void;
  onStartExercise: (exercise: Exercise) => void;
  streakDays: number;
  caloriesBurnedToday: number;
  minutesActiveToday: number;
  caloriesConsumedToday: number;
  targetCalories: number;
  wearableBpm: number;
  isWearableConnected: boolean;
  waterLoggedMl: number;
  userProfile: UserProfile;
}

export const DashboardHomeView: React.FC<DashboardHomeViewProps> = ({
  onNavigateTab,
  onStartExercise,
  streakDays,
  caloriesBurnedToday,
  minutesActiveToday,
  caloriesConsumedToday,
  targetCalories,
  wearableBpm,
  isWearableConnected,
  waterLoggedMl,
  userProfile,
}) => {
  const featuredExercise = EXERCISES_DATA[0]; // Jumping jacks
  const featuredMeal = HEALTHY_MEALS_DATA[0]; // Dada Ayam Panggang Sambal Matah

  const remainingKcal = targetCalories - caloriesConsumedToday + caloriesBurnedToday;

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-linear-to-r from-slate-900 via-slate-800 to-emerald-950 text-white shadow-xl overflow-hidden border border-slate-800">
        {/* Glow backdrop */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            {/* Pill-free metadata according to frontend-design */}
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>Program Kebugaran Harian Aktif</span>
              <span aria-hidden="true">·</span>
              <span>Streak {streakDays} Hari Berturut-turut</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Tubuh Bugar & Berenergi Dimulai dari Hari Ini
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Panduan latihan animasi interaktif, nutrisi makanan sehat terukur, serta sinkronisasi detak jantung real-time untuk mendukung performa optimal Anda.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onStartExercise(featuredExercise)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/25 active:scale-98 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Mulai Sesi Hari Ini: {featuredExercise.name}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('nutrisi')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-colors cursor-pointer"
              >
                Cek Menu Nutrisi
              </button>
            </div>
          </div>

          {/* Quick Streak Trophy Box */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center text-center shrink-0 w-full md:w-44">
            <Flame className="w-8 h-8 text-amber-400 fill-amber-400 mb-1 animate-pulse" />
            <span className="text-3xl font-extrabold font-mono tabular-nums text-white">
              {streakDays}
            </span>
            <span className="text-[11px] text-slate-300 font-medium uppercase tracking-wider">
              Hari Konsisten
            </span>
            <span className="text-[10px] text-emerald-400 mt-1">
              Top 10% Pengguna
            </span>
          </div>
        </div>
      </div>

      {/* 4 Primary Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Calories Burned */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Kalori Terbakar</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="my-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
              {caloriesBurnedToday}
            </span>
            <span className="text-xs text-slate-400 ml-1">kcal</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Target harian: 350 kcal
          </span>
        </div>

        {/* Minutes Active */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Waktu Latihan</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="my-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
              {minutesActiveToday}
            </span>
            <span className="text-xs text-slate-400 ml-1">menit</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1">
            Target 20 menit tercapai!
          </span>
        </div>

        {/* Remaining Calories */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Sisa Kalori Makan</span>
            <Utensils className="w-4 h-4 text-blue-500" />
          </div>
          <div className="my-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
              {remainingKcal}
            </span>
            <span className="text-xs text-slate-400 ml-1">kcal</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {caloriesConsumedToday} dari {targetCalories} kcal masuk
          </span>
        </div>

        {/* Live Wearable Heart Rate */}
        <div
          onClick={() => onNavigateTab('wearable')}
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs flex flex-col justify-between cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Sensor Wearable</span>
            <Heart className={`w-4 h-4 text-rose-500 ${isWearableConnected ? 'animate-pulse' : ''}`} />
          </div>
          <div className="my-1 flex items-baseline">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
              {isWearableConnected ? wearableBpm : '--'}
            </span>
            <span className="text-xs text-slate-400 ml-1">BPM</span>
          </div>
          <span className={`text-[11px] font-medium block mt-1 ${isWearableConnected ? 'text-emerald-500' : 'text-slate-400'}`}>
            {isWearableConnected ? 'Zona Pembakaran Lemak' : 'Klik untuk hubungkan'}
          </span>
        </div>
      </div>

      {/* 2-Column Spotlight: Featured Workout & Featured Healthy Meal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workout Spotlight */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                Latihan Unggulan
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {featuredExercise.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('olahraga')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            {featuredExercise.description}
          </p>

          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Target Otot</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                {featuredExercise.primaryMuscle}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Durasi</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {featuredExercise.durationSec}s
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Tingkat</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {featuredExercise.difficulty}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onStartExercise(featuredExercise)}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs shadow-emerald-500/20 active:scale-98 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Mulai Sesi Animasi Sekarang</span>
          </button>
        </div>

        {/* Healthy Meal Spotlight */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                Rekomendasi Menu Sehat
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {featuredMeal.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('nutrisi')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Resep Lainnya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            {featuredMeal.healthBenefit}
          </p>

          <div className="grid grid-cols-4 gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs text-center">
            <div>
              <span className="text-slate-400 block text-[10px]">Kalori</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                {featuredMeal.calories}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Protein</span>
              <span className="font-bold font-mono text-blue-500">
                {featuredMeal.proteinG}g
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Karbo</span>
              <span className="font-bold font-mono text-amber-500">
                {featuredMeal.carbsG}g
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Lemak</span>
              <span className="font-bold font-mono text-rose-500">
                {featuredMeal.fatG}g
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('nutrisi')}
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Utensils className="w-4 h-4 text-emerald-500" />
            <span>Lihat Resep & Catat Makanan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
