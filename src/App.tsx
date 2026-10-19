import React, { useState, useEffect } from 'react';
import {
  Activity,
  Flame,
  Utensils,
  TrendingUp,
  Watch,
  Users,
  Settings,
  HelpCircle,
  Share2,
  Moon,
  Sun,
  Play,
  Cloud,
  CloudOff,
  Check,
} from 'lucide-react';
import {
  NavigationTab,
  Exercise,
  LoggedMeal,
  WeightRecord,
  WorkoutHistoryEntry,
  CommunityPost,
  ReminderSetting,
  AppSettings,
} from './types';
import { EXERCISES_DATA } from './data/exercises';
import { StorageService } from './utils/storage';
import { UserProfile, calculateTargetCalories } from './utils/fitness';
import { DashboardHomeView } from './components/DashboardHomeView';
import { ExercisesCatalogView } from './components/ExercisesCatalogView';
import { NutritionView } from './components/NutritionView';
import { ProgressStatsView } from './components/ProgressStatsView';
import { WearableMonitorView } from './components/WearableMonitorView';
import { CommunityForumView } from './components/CommunityForumView';
import { SettingsView } from './components/SettingsView';
import { WorkoutPlayerModal } from './components/WorkoutPlayerModal';
import { SocialShareModal } from './components/SocialShareModal';
import { BeginnerGuideModal } from './components/BeginnerGuideModal';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('beranda');

  // Persistence & State
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getAppSettings());
  const [userProfile, setUserProfile] = useState<UserProfile>(() => StorageService.getUserProfile());
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>(() => StorageService.getLoggedMeals());
  const [waterLoggedMl, setWaterLoggedMl] = useState<number>(() => StorageService.getWaterLoggedMl());
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistoryEntry[]>(() => StorageService.getWorkoutHistory());
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(() => StorageService.getWeightRecords());
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => StorageService.getCommunityPosts());
  const [reminders, setReminders] = useState<ReminderSetting[]>(() => StorageService.getReminders());
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => StorageService.getLastCloudSync());

  // Online / Offline listener
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Wearable live state
  const [isWearableConnected, setIsWearableConnected] = useState<boolean>(true);
  const [wearableBpm, setWearableBpm] = useState<number>(126);
  const [wearableDeviceName, setWearableDeviceName] = useState<string>('Apple Watch Ultra 2 (Bluetooth BLE)');

  // Modals
  const [activeExerciseForPlayer, setActiveExerciseForPlayer] = useState<Exercise | null>(null);
  const [isSocialShareOpen, setIsSocialShareOpen] = useState<boolean>(false);
  const [isBeginnerGuideOpen, setIsBeginnerGuideOpen] = useState<boolean>(false);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.isDarkMode]);

  // Online / Offline event listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      const time = StorageService.recordCloudSync();
      setLastSyncTime(time);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save changes to storage
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    StorageService.saveAppSettings(newSettings);
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    StorageService.saveUserProfile(newProfile);
  };

  const handleAddMeal = (meal: LoggedMeal) => {
    const updated = [meal, ...loggedMeals];
    setLoggedMeals(updated);
    StorageService.saveLoggedMeals(updated);
  };

  const handleDeleteMeal = (mealId: string) => {
    const updated = loggedMeals.filter((m) => m.id !== mealId);
    setLoggedMeals(updated);
    StorageService.saveLoggedMeals(updated);
  };

  const handleUpdateWater = (ml: number) => {
    setWaterLoggedMl(ml);
    StorageService.saveWaterLoggedMl(ml);
  };

  const handleAddWeightRecord = (record: WeightRecord) => {
    const updated = [...weightRecords, record];
    setWeightRecords(updated);
    StorageService.saveWeightRecords(updated);
    // Update profile weight
    handleUpdateProfile({ ...userProfile, weightKg: record.weightKg });
  };

  const handleWorkoutCompleted = (exercise: Exercise, durationSec: number, caloriesBurned: number) => {
    const entry: WorkoutHistoryEntry = {
      id: 'w-' + Date.now(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      durationSec,
      caloriesBurned,
      completedAt: new Date().toISOString(),
      avgHeartRate: wearableBpm,
    };
    const updated = [entry, ...workoutHistory];
    setWorkoutHistory(updated);
    StorageService.saveWorkoutHistory(updated);
    StorageService.recordCloudSync();
    setLastSyncTime(StorageService.getLastCloudSync());
  };

  const handleAddCommunityPost = (post: CommunityPost) => {
    const updated = [post, ...communityPosts];
    setCommunityPosts(updated);
    StorageService.saveCommunityPosts(updated);
  };

  const handleLikePost = (postId: string) => {
    const updated = communityPosts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          hasLiked: !p.hasLiked,
          likesCount: p.hasLiked ? p.likesCount - 1 : p.likesCount + 1,
        };
      }
      return p;
    });
    setCommunityPosts(updated);
    StorageService.saveCommunityPosts(updated);
  };

  const handleAddComment = (postId: string, content: string) => {
    const updated = communityPosts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: 'c-' + Date.now(),
              authorName: 'Pengguna Bugar (Saya)',
              content,
              createdAt: 'Baru saja',
            },
          ],
        };
      }
      return p;
    });
    setCommunityPosts(updated);
    StorageService.saveCommunityPosts(updated);
  };

  const handleManualSync = () => {
    const time = StorageService.recordCloudSync();
    setLastSyncTime(time);
  };

  const handleExportData = () => {
    const jsonStr = StorageService.exportAllDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bugarku_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonStr: string) => {
    const success = StorageService.importAllDataJSON(jsonStr);
    if (success) {
      setSettings(StorageService.getAppSettings());
      setUserProfile(StorageService.getUserProfile());
      setLoggedMeals(StorageService.getLoggedMeals());
      setWaterLoggedMl(StorageService.getWaterLoggedMl());
      setWorkoutHistory(StorageService.getWorkoutHistory());
      setWeightRecords(StorageService.getWeightRecords());
      setCommunityPosts(StorageService.getCommunityPosts());
      setReminders(StorageService.getReminders());
      setLastSyncTime(StorageService.getLastCloudSync());
    }
    return success;
  };

  // Calculations for dashboard
  const targetCalories = calculateTargetCalories(userProfile);
  const caloriesConsumedToday = loggedMeals.reduce((acc, m) => acc + m.calories, 0);
  const caloriesBurnedToday = workoutHistory.reduce((acc, w) => acc + w.caloriesBurned, 0);
  const minutesActiveToday = Math.round(workoutHistory.reduce((acc, w) => acc + w.durationSec, 0) / 60);
  const streakDays = Math.max(1, workoutHistory.length > 0 ? 7 : 1);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Bar Contract complying strictly with frontend-design:
          Zone 1: Single text element wordmark
          Zone 2: 4-5 clean single-line nav links
          Zone 3: 1 primary action */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab('beranda')}
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
            <span>BugarKu ID</span>
          </button>

          {/* Zone 2: Clean single-line text nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-400">
            <button
              type="button"
              onClick={() => setActiveTab('beranda')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'beranda' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
              }`}
            >
              Beranda
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('olahraga')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'olahraga' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
              }`}
            >
              Latihan Olahraga
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('nutrisi')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'nutrisi' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
              }`}
            >
              Nutrisi & Makanan
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('progres')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'progres' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
              }`}
            >
              Statistik Progres
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('wearable')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'wearable' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
              }`}
            >
              Wearable & BPM
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('komunitas')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'komunitas' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''
              }`}
            >
              Komunitas
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick dark mode icon */}
            <button
              type="button"
              onClick={() => handleUpdateSettings({ ...settings, isDarkMode: !settings.isDarkMode })}
              className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={settings.isDarkMode ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
            >
              {settings.isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Quick settings icon */}
            <button
              type="button"
              onClick={() => setActiveTab('pengaturan')}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'pengaturan'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-500'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              aria-label="Pengaturan"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => setIsBeginnerGuideOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
              <span>Panduan Pemula</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12">
        {activeTab === 'beranda' && (
          <DashboardHomeView
            onNavigateTab={setActiveTab}
            onStartExercise={(ex) => setActiveExerciseForPlayer(ex)}
            streakDays={streakDays}
            caloriesBurnedToday={caloriesBurnedToday}
            minutesActiveToday={minutesActiveToday}
            caloriesConsumedToday={caloriesConsumedToday}
            targetCalories={targetCalories}
            wearableBpm={wearableBpm}
            isWearableConnected={isWearableConnected}
            waterLoggedMl={waterLoggedMl}
            userProfile={userProfile}
          />
        )}

        {activeTab === 'olahraga' && (
          <ExercisesCatalogView
            onWorkoutCompleted={(ex, dur, cals) => handleWorkoutCompleted(ex, dur, cals)}
            wearableBpm={wearableBpm}
          />
        )}

        {activeTab === 'nutrisi' && (
          <NutritionView
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            loggedMeals={loggedMeals}
            onAddMeal={handleAddMeal}
            onDeleteMeal={handleDeleteMeal}
            waterLoggedMl={waterLoggedMl}
            onUpdateWater={handleUpdateWater}
            caloriesBurnedToday={caloriesBurnedToday}
          />
        )}

        {activeTab === 'progres' && (
          <ProgressStatsView
            userProfile={userProfile}
            weightRecords={weightRecords}
            onAddWeightRecord={handleAddWeightRecord}
            workoutHistory={workoutHistory}
            totalWaterLoggedMl={waterLoggedMl}
            communityPostsCount={communityPosts.length}
            onOpenSocialShare={() => setIsSocialShareOpen(true)}
          />
        )}

        {activeTab === 'wearable' && (
          <WearableMonitorView
            currentBpm={wearableBpm}
            onBpmChange={setWearableBpm}
            isConnected={isWearableConnected}
            onConnectionToggle={setIsWearableConnected}
            deviceName={wearableDeviceName}
            onDeviceChange={setWearableDeviceName}
          />
        )}

        {activeTab === 'komunitas' && (
          <CommunityForumView
            posts={communityPosts}
            onAddPost={handleAddCommunityPost}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
          />
        )}

        {activeTab === 'pengaturan' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            reminders={reminders}
            onUpdateReminders={(newRems) => {
              setReminders(newRems);
              StorageService.saveReminders(newRems);
            }}
            lastSyncTime={lastSyncTime}
            onManualSync={handleManualSync}
            onExportData={handleExportData}
            onImportData={handleImportData}
            onOpenBeginnerGuide={() => setIsBeginnerGuideOpen(true)}
            isOnline={isOnline}
          />
        )}
      </main>

      {/* Mobile Touch Bottom Tab Bar (Fixed thumb-zone ergonomic navigation) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-1 px-2 flex items-center justify-around">
        <button
          type="button"
          onClick={() => setActiveTab('beranda')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors min-w-[48px] min-h-[48px] ${
            activeTab === 'beranda' ? 'text-emerald-500 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Activity className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Beranda</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('olahraga')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors min-w-[48px] min-h-[48px] ${
            activeTab === 'olahraga' ? 'text-emerald-500 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Latihan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('nutrisi')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors min-w-[48px] min-h-[48px] ${
            activeTab === 'nutrisi' ? 'text-emerald-500 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Utensils className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Nutrisi</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('progres')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors min-w-[48px] min-h-[48px] ${
            activeTab === 'progres' ? 'text-emerald-500 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Progres</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wearable')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors min-w-[48px] min-h-[48px] ${
            activeTab === 'wearable' ? 'text-emerald-500 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Watch className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Wearable</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('komunitas')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors min-w-[48px] min-h-[48px] ${
            activeTab === 'komunitas' ? 'text-emerald-500 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Forum</span>
        </button>
      </nav>

      {/* Global Workout Player Modal */}
      {activeExerciseForPlayer && (
        <WorkoutPlayerModal
          exercise={activeExerciseForPlayer}
          isOpen={!!activeExerciseForPlayer}
          onClose={() => setActiveExerciseForPlayer(null)}
          onComplete={(dur, cals) => {
            handleWorkoutCompleted(activeExerciseForPlayer, dur, cals);
          }}
          simulatedBpm={wearableBpm}
        />
      )}

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={isSocialShareOpen}
        onClose={() => setIsSocialShareOpen(false)}
        streakDays={streakDays}
        totalCaloriesBurned={caloriesBurnedToday}
        totalWorkouts={workoutHistory.length}
      />

      {/* Beginner Guide Modal */}
      <BeginnerGuideModal
        isOpen={isBeginnerGuideOpen}
        onClose={() => setIsBeginnerGuideOpen(false)}
      />
    </div>
  );
}
