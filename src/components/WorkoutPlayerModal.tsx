import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle, Flame, Heart, Volume2, VolumeX } from 'lucide-react';
import { Exercise } from '../types';
import { ExerciseAnimation } from './ExerciseAnimation';
import { soundEffects } from '../utils/audio';

interface WorkoutPlayerModalProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (completedDurationSec: number, caloriesBurned: number) => void;
  simulatedBpm?: number;
}

export const WorkoutPlayerModal: React.FC<WorkoutPlayerModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onComplete,
  simulatedBpm = 132,
}) => {
  const [countdown, setCountdown] = useState<number>(3);
  const [isStarting, setIsStarting] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(exercise.durationSec);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setCountdown(3);
      setIsStarting(true);
      setTimeLeft(exercise.durationSec);
      setIsPaused(false);
      setIsFinished(false);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOpen, exercise]);

  // Preparation 3.. 2.. 1.. countdown
  useEffect(() => {
    if (!isOpen || !isStarting) return;

    if (countdown > 0) {
      if (soundEnabled) soundEffects.playTick();
      const timeout = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timeout);
    } else {
      if (soundEnabled) soundEffects.playStart();
      setIsStarting(false);
    }
  }, [isOpen, isStarting, countdown, soundEnabled]);

  // Active workout timer
  useEffect(() => {
    if (!isOpen || isStarting || isPaused || isFinished) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsFinished(true);
          if (soundEnabled) soundEffects.playComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isStarting, isPaused, isFinished, soundEnabled]);

  if (!isOpen) return null;

  const totalTime = exercise.durationSec;
  const progressPercent = Math.round(((totalTime - timeLeft) / totalTime) * 100);
  const elapsedSec = totalTime - timeLeft;
  const caloriesBurnedNow = Math.max(1, Math.round((elapsedSec / totalTime) * exercise.caloriesBurned));

  const handleFinishEarly = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsFinished(true);
    if (soundEnabled) soundEffects.playComplete();
  };

  const handleSaveAndClose = () => {
    onComplete(elapsedSec, caloriesBurnedNow);
    onClose();
  };

  // SVG circular timer radius math
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {exercise.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Target: {exercise.primaryMuscle} · {exercise.difficulty}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={soundEnabled ? 'Matikan suara audio' : 'Nyalakan suara audio'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-500" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Tutup jendela latihan"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col items-center">
          {/* Preparation Countdown Overlay */}
          {isStarting ? (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Siap-Siap
              </span>
              <div className="my-6 text-7xl font-extrabold text-emerald-500 animate-pulse font-mono tabular-nums">
                {countdown}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm text-center">
                Posisikan tubuh Anda dengan benar. Dengarkan panduan pernapasan dan ikuti ritme gerakan!
              </p>
            </div>
          ) : isFinished ? (
            /* Celebration Screen */
            <div className="flex flex-col items-center text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                Latihan Selesai! Luar Biasa!
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                Setiap tetes keringat membawa Anda semakin dekat ke tubuh bugar dan bertenaga.
              </p>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-md my-6">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center">
                  <span className="text-xs text-slate-500">Durasi</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                    {Math.floor(elapsedSec / 60)}m {elapsedSec % 60}s
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center">
                  <span className="text-xs text-slate-500">Kalori</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                    {caloriesBurnedNow} kcal
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center">
                  <span className="text-xs text-slate-500">Avg BPM</span>
                  <span className="text-lg font-bold text-rose-500 font-mono tabular-nums">
                    {simulatedBpm}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveAndClose}
                className="w-full max-w-md py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all shadow-md shadow-emerald-500/20 active:scale-98 cursor-pointer"
              >
                Simpan ke Progres & Selesai
              </button>
            </div>
          ) : (
            /* Active Exercise Live Player */
            <div className="w-full flex flex-col items-center gap-6">
              {/* Exercise Demonstration */}
              <ExerciseAnimation
                animationKey={exercise.animationKey}
                primaryMuscle={exercise.primaryMuscle}
                isPlaying={!isPaused}
              />

              {/* Circular Timer & Stats Row */}
              <div className="flex flex-col md:flex-row items-center justify-around w-full gap-4">
                {/* SVG Timer */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      className="stroke-slate-100 dark:stroke-slate-800"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      className="stroke-emerald-500 transition-all duration-300 ease-linear"
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 60}
                      strokeDashoffset={(2 * Math.PI * 60) * (1 - (totalTime - timeLeft) / totalTime)}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                      Tersisa
                    </span>
                  </div>
                </div>

                {/* Live Real-time Vitals & Burn Metrics */}
                <div className="flex flex-col gap-2 w-full max-w-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-xs text-slate-600 dark:text-slate-300">Kalori Terbakar</span>
                    </div>
                    <span className="text-sm font-bold font-mono tabular-nums text-orange-600 dark:text-orange-400">
                      {caloriesBurnedNow} kcal
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
                      <span className="text-xs text-slate-600 dark:text-slate-300">Sensor Wearable</span>
                    </div>
                    <span className="text-sm font-bold font-mono tabular-nums text-rose-500">
                      {simulatedBpm} BPM
                    </span>
                  </div>

                  <div className="p-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100/60 dark:bg-slate-800/40 rounded-lg">
                    💡 <span className="font-medium text-slate-700 dark:text-slate-300">Tips Napas:</span> {exercise.breathingTip}
                  </div>
                </div>
              </div>

              {/* Player Controls Bar */}
              <div className="flex items-center justify-center gap-4 w-full pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTimeLeft(exercise.durationSec);
                    setIsPaused(false);
                  }}
                  className="p-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  title="Ulangi dari awal"
                  aria-label="Ulangi latihan"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 transition-transform active:scale-95 cursor-pointer"
                  aria-label={isPaused ? 'Lanjutkan latihan' : 'Jeda latihan'}
                >
                  {isPaused ? <Play className="w-6 h-6 fill-white ml-0.5" /> : <Pause className="w-6 h-6" />}
                </button>

                <button
                  type="button"
                  onClick={handleFinishEarly}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                  aria-label="Selesaikan latihan sekarang"
                >
                  Selesai
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
