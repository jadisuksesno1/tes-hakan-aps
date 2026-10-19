import React, { useState } from 'react';
import { TrendingDown, Award, Calendar, Scale, Activity, Plus, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { WeightRecord, WorkoutHistoryEntry } from '../types';
import { UserProfile, calculateBMI, evaluateBadges, UserStats } from '../utils/fitness';

interface ProgressStatsViewProps {
  userProfile: UserProfile;
  weightRecords: WeightRecord[];
  onAddWeightRecord: (record: WeightRecord) => void;
  workoutHistory: WorkoutHistoryEntry[];
  totalWaterLoggedMl: number;
  communityPostsCount: number;
  onOpenSocialShare: () => void;
}

export const ProgressStatsView: React.FC<ProgressStatsViewProps> = ({
  userProfile,
  weightRecords,
  onAddWeightRecord,
  workoutHistory,
  totalWaterLoggedMl,
  communityPostsCount,
  onOpenSocialShare,
}) => {
  const [newWeight, setNewWeight] = useState<number>(userProfile.weightKg);
  const [newWaist, setNewWaist] = useState<number>(82);
  const [isLogWeightOpen, setIsLogWeightOpen] = useState<boolean>(false);

  // BMI details
  const bmiInfo = calculateBMI(userProfile.weightKg, userProfile.heightCm);

  // Calculate stats for badges & analysis
  const totalCaloriesBurned = workoutHistory.reduce((acc, w) => acc + w.caloriesBurned, 0);
  const totalDurationMin = Math.round(workoutHistory.reduce((acc, w) => acc + w.durationSec, 0) / 60);

  // Approximate streak
  const streakDays = Math.max(1, workoutHistory.length > 0 ? 5 : 0);

  const userStats: UserStats = {
    streakDays,
    totalWorkouts: workoutHistory.length,
    totalCaloriesBurned,
    totalWaterLoggedMl,
    communityPostsCount,
  };

  const badges = evaluateBadges(userStats);
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  // Weight progression calculation
  const initialWeight = weightRecords[0]?.weightKg || userProfile.weightKg;
  const currentWeight = weightRecords[weightRecords.length - 1]?.weightKg || userProfile.weightKg;
  const weightDiff = Number((currentWeight - initialWeight).toFixed(1));

  // Chart coordinate math for Weight SVG
  const minW = Math.min(...weightRecords.map((r) => r.weightKg)) - 1;
  const maxW = Math.max(...weightRecords.map((r) => r.weightKg)) + 1;
  const chartHeight = 120;
  const chartWidth = 320;

  const points = weightRecords.map((record, idx) => {
    const x = (idx / Math.max(1, weightRecords.length - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - ((record.weightKg - minW) / (maxW - minW)) * (chartHeight - 30) - 15;
    return { x, y, record };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Days of week volume mockup for weekly bar chart
  const weeklyDays = [
    { day: 'Sen', min: 25, kcal: 180 },
    { day: 'Sel', min: 30, kcal: 220 },
    { day: 'Rab', min: 15, kcal: 110 },
    { day: 'Kam', min: 35, kcal: 260 },
    { day: 'Jum', min: 20, kcal: 150 },
    { day: 'Sab', min: 45, kcal: 340 },
    { day: 'Min', min: 10, kcal: 70 },
  ];
  const maxDayKcal = Math.max(...weeklyDays.map((d) => d.kcal));

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    onAddWeightRecord({
      date: today,
      weightKg: Number(newWeight) || userProfile.weightKg,
      waistCm: Number(newWaist) || undefined,
    });
    setIsLogWeightOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header and Social Share Callout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Statistik Perkembangan & Analisis Tubuh
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pantau transformasi fisik, konsistensi mingguan, dan pencapaian kebugaran Anda secara menyeluruh.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLogWeightOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-500" />
            <span>Catat Timbangan Baru</span>
          </button>
          <button
            type="button"
            onClick={onOpenSocialShare}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-xs shadow-emerald-500/20 active:scale-98 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Bagikan Kartu Prestasi</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Strips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Berat Saat Ini</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {currentWeight}
            </span>
            <span className="text-xs text-slate-400">kg</span>
          </div>
          <span className={`text-[11px] font-medium mt-1 block ${weightDiff <= 0 ? 'text-emerald-500' : 'text-orange-500'}`}>
            {weightDiff <= 0 ? `Turun ${Math.abs(weightDiff)} kg` : `Naik +${weightDiff} kg`} sejak awal
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Status Indeks Massa Tubuh (BMI)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {bmiInfo.bmi}
            </span>
            <span className={`text-xs font-semibold ${bmiInfo.color}`}>
              {bmiInfo.category}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Rentang ideal: {bmiInfo.idealWeightRange.min} - {bmiInfo.idealWeightRange.max} kg
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Total Kalori Terbakar</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-orange-500">
              {totalCaloriesBurned}
            </span>
            <span className="text-xs text-slate-400">kcal</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Dari {workoutHistory.length} sesi latihan aktif
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <span className="text-xs text-slate-500 block mb-1">Pencapaian Terbuka</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-500">
              {unlockedBadgesCount}
            </span>
            <span className="text-xs text-slate-400">/ {badges.length} Lencana</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Tingkat Konsistensi: 92%
          </span>
        </div>
      </div>

      {/* Graphical Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Progression Chart */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Grafik Tren Berat Badan
              </h3>
              <p className="text-xs text-slate-500">
                Visualisasi progres penurunan dan kestabilan massa tubuh
              </p>
            </div>
            <Scale className="w-5 h-5 text-emerald-500" />
          </div>

          {/* SVG Weight Line */}
          <div className="w-full overflow-x-auto py-2">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-40 select-none">
              {/* Horizontal gridlines */}
              <line x1="20" y1="20" x2={chartWidth - 20} y2="20" className="stroke-slate-100 dark:stroke-slate-800" strokeDasharray="3 3" />
              <line x1="20" y1="60" x2={chartWidth - 20} y2="60" className="stroke-slate-100 dark:stroke-slate-800" strokeDasharray="3 3" />
              <line x1="20" y1="100" x2={chartWidth - 20} y2="100" className="stroke-slate-100 dark:stroke-slate-800" strokeDasharray="3 3" />

              {/* Area gradient fill under path */}
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <path
                d={`${pathD} L ${points[points.length - 1]?.x || 0} ${chartHeight - 10} L ${points[0]?.x || 0} ${chartHeight - 10} Z`}
                fill="url(#weightGrad)"
              />

              {/* Connecting line */}
              <path
                d={pathD}
                fill="none"
                className="stroke-emerald-500"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points */}
              {points.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    className="fill-white dark:fill-slate-900 stroke-emerald-500"
                    strokeWidth="2.5"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 8}
                    textAnchor="middle"
                    className="text-[9px] font-mono tabular-nums fill-slate-600 dark:fill-slate-300 font-semibold"
                  >
                    {pt.record.weightKg}
                  </text>
                  <text
                    x={pt.x}
                    y={chartHeight - 2}
                    textAnchor="middle"
                    className="text-[8px] fill-slate-400"
                  >
                    {pt.record.date.slice(5)}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Awal: {initialWeight} kg</span>
            <span>Target: {userProfile.weightKg - 3} kg</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Progres Berjalan Baik
            </span>
          </div>
        </div>

        {/* Weekly Workout Volume Bar Chart */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Aktivitas & Pembakaran Kalori Mingguan
              </h3>
              <p className="text-xs text-slate-500">
                Konsistensi durasi dan intensitas latihan 7 hari terakhir
              </p>
            </div>
            <Activity className="w-5 h-5 text-orange-500" />
          </div>

          {/* Bar Chart Container */}
          <div className="h-40 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
            {weeklyDays.map((d, i) => {
              const heightPct = Math.round((d.kcal / maxDayKcal) * 100);
              const isPeak = d.kcal === maxDayKcal;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] font-mono tabular-nums text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">
                    {d.kcal}
                  </span>
                  <div className="w-full max-w-[28px] bg-slate-100 dark:bg-slate-800 rounded-t-lg h-full max-h-[85px] flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isPeak ? 'bg-orange-500' : 'bg-emerald-500 hover:bg-emerald-400'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Rata-rata: 190 kcal/hari</span>
            <span>Total Durasi: 180 menit</span>
            <span className="font-semibold text-orange-500">Sabtu (Puncak)</span>
          </div>
        </div>
      </div>

      {/* Deep In-Depth Weekly Analysis Section (As requested by user) */}
      <div className="p-6 bg-linear-to-r from-emerald-500/10 via-slate-50 to-emerald-500/5 dark:from-emerald-950/30 dark:via-slate-900 dark:to-emerald-950/10 border border-emerald-500/20 dark:border-emerald-800/40 rounded-3xl space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Analisis Performa Mingguan Mendalam
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <span className="font-semibold text-slate-900 dark:text-white block mb-1">
              Fokus Distribusi Otot
            </span>
            <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Tubuh Bagian Bawah (Legs & Glutes)</span>
                <span className="font-bold font-mono">40%</span>
              </div>
              <div className="flex justify-between">
                <span>Kardiovaskular Aerobik</span>
                <span className="font-bold font-mono">30%</span>
              </div>
              <div className="flex justify-between">
                <span>Dada, Lengan & Bahu</span>
                <span className="font-bold font-mono">20%</span>
              </div>
              <div className="flex justify-between">
                <span>Core & Otot Perut</span>
                <span className="font-bold font-mono">10%</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <span className="font-semibold text-slate-900 dark:text-white block mb-1">
              Tren Detak Jantung & Intensitas
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Sebagian besar latihan Anda berada di <span className="font-semibold text-emerald-600 dark:text-emerald-400">Zona Pembakaran Lemak (120-140 BPM)</span>. Ini sangat efektif untuk metabolisme oksidasi lipid tanpa memicu kelelahan saraf berlebih.
            </p>
          </div>

          <div className="p-4 bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <span className="font-semibold text-slate-900 dark:text-white block mb-1">
              Rekomendasi Pelatih untuk Minggu Depan
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Tingkatkan variasi latihan penguatan inti (Plank & Russian Twists) menjadi 2x seminggu untuk mendukung kestabilan tulang belakang saat melakukan squat dan lunge berbeban.
            </p>
          </div>
        </div>
      </div>

      {/* Gamification & Badges Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Lencana Pencapaian & Konsistensi
            </h3>
            <p className="text-xs text-slate-500">
              Penghargaan atas dedikasi dan konsistensi berolahraga tanpa henti
            </p>
          </div>
          <Award className="w-5 h-5 text-amber-500" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                b.unlocked
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      b.unlocked
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}
                  >
                    <Award className="w-5 h-5" />
                  </div>
                  {b.unlocked && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Terbuka
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  {b.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {b.description}
                </p>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Progres</span>
                  <span className="font-mono tabular-nums">{b.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${b.unlocked ? 'bg-emerald-500' : 'bg-slate-400'}`}
                    style={{ width: `${b.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Weight Modal */}
      {isLogWeightOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleSaveWeight}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Catat Timbangan Hari Ini
              </h3>
              <button
                type="button"
                onClick={() => setIsLogWeightOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Berat Badan (kg)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={newWeight}
                onChange={(e) => setNewWeight(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Lingkar Pinggang (cm) - Opsional
              </label>
              <input
                type="number"
                step="0.5"
                value={newWaist}
                onChange={(e) => setNewWaist(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsLogWeightOpen(false)}
                className="flex-1 py-2.5 font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 font-semibold rounded-xl bg-emerald-500 text-white shadow-xs"
              >
                Simpan Progres
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
