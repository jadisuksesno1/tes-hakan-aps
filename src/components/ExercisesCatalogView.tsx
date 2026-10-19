import React, { useState } from 'react';
import { Search, Flame, Clock, Dumbbell, ChevronRight, Info, Check, Play } from 'lucide-react';
import { Exercise, ExerciseCategory, ExerciseDifficulty } from '../types';
import { EXERCISES_DATA } from '../data/exercises';
import { ExerciseAnimation } from './ExerciseAnimation';
import { WorkoutPlayerModal } from './WorkoutPlayerModal';

interface ExercisesCatalogViewProps {
  onWorkoutCompleted: (exercise: Exercise, durationSec: number, caloriesBurned: number) => void;
  wearableBpm?: number;
}

export const ExercisesCatalogView: React.FC<ExercisesCatalogViewProps> = ({
  onWorkoutCompleted,
  wearableBpm = 128,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory>('Semua');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeExerciseForPlayer, setActiveExerciseForPlayer] = useState<Exercise | null>(null);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  const categories: ExerciseCategory[] = [
    'Semua',
    'Kardio',
    'Perut & Core',
    'Lengan & Bahu',
    'Kaki & Bokong',
    'Peregangan',
  ];

  const filteredExercises = EXERCISES_DATA.filter((ex) => {
    const matchesCategory = selectedCategory === 'Semua' || ex.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'Semua' || ex.difficulty === selectedDifficulty;
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.primaryMuscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Katalog Olahraga & Panduan Gerakan
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pelajari biomekanika gerakan tubuh dengan animasi interaktif, instruksi langkah demi langkah, dan target otot spesifik.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari gerakan atau otot..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 dark:text-white placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Filter Tabs (Interactive buttons complying with frontend-design) */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          {['Semua', 'Pemula', 'Menengah'].map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => {
          const isExpanded = expandedExerciseId === exercise.id;

          return (
            <div
              key={exercise.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div>
                {/* Exercise Animation Preview */}
                <div className="p-4 bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/60">
                  <ExerciseAnimation
                    animationKey={exercise.animationKey}
                    primaryMuscle={exercise.primaryMuscle}
                    isPlaying={false}
                  />
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  {/* Clean unboxed metadata according to frontend-design */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {exercise.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Tingkat {exercise.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span>{exercise.primaryMuscle}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {exercise.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {exercise.description}
                  </p>

                  {/* Quick specs */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exercise.durationSec} detik {exercise.defaultReps ? `(${exercise.defaultReps} rep)` : ''}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span>~{exercise.caloriesBurned} kcal terbakar</span>
                    </div>
                  </div>

                  {/* Expandable Details Accordion */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fade-in text-xs">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1.5">
                          Fungsi & Manfaat Utama:
                        </h4>
                        <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                          {exercise.benefits.map((b, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-500 font-bold shrink-0">✓</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1.5">
                          Instruksi Langkah Demi Langkah:
                        </h4>
                        <ol className="space-y-1.5 text-slate-600 dark:text-slate-300 list-decimal pl-4">
                          {exercise.steps.map((st, idx) => (
                            <li key={idx} className="pl-1">
                              {st}
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                        <span className="font-semibold">Irama Pernapasan:</span> {exercise.breathingTip}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setExpandedExerciseId(isExpanded ? null : exercise.id)}
                  className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer text-center"
                >
                  {isExpanded ? 'Tutup Detail' : 'Detail & Manfaat'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveExerciseForPlayer(exercise)}
                  className="flex items-center justify-center gap-1.5 flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-xs shadow-emerald-500/20 active:scale-98 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Mulai Latihan</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Workout Player Modal */}
      {activeExerciseForPlayer && (
        <WorkoutPlayerModal
          exercise={activeExerciseForPlayer}
          isOpen={!!activeExerciseForPlayer}
          onClose={() => setActiveExerciseForPlayer(null)}
          onComplete={(dur, cals) => {
            onWorkoutCompleted(activeExerciseForPlayer, dur, cals);
          }}
          simulatedBpm={wearableBpm}
        />
      )}
    </div>
  );
};
