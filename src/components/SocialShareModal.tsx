import React, { useState } from 'react';
import { X, Share2, Copy, Check, Flame, Trophy, Calendar, Sparkles } from 'lucide-react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakDays: number;
  totalCaloriesBurned: number;
  totalWorkouts: number;
  userName?: string;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  streakDays,
  totalCaloriesBurned,
  totalWorkouts,
  userName = 'Atlet BugarKu',
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);

  if (!isOpen) return null;

  const shareText = `🔥 Progres Kebugaran BugarKu Saya!\n` +
    `⚡ Streak Konsisten: ${streakDays} Hari Berturut-turut\n` +
    `💪 Total Sesi Latihan: ${totalWorkouts} Sesi\n` +
    `🔥 Kalori Terbakar: ${totalCaloriesBurned} kcal\n` +
    `Konsistensi setiap hari mengalahkan intensitas sesaat! #BugarKu #GayaHidupSehat #FitnessIndonesia`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard copy failed:', e);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Progres Olahraga BugarKu',
          text: shareText,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        console.log('Share canceled or not supported:', err);
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Bagikan Prestasi Kebugaran
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Story Card Preview */}
        <div className="relative rounded-3xl p-6 bg-linear-to-br from-emerald-600 via-teal-700 to-slate-900 text-white shadow-xl overflow-hidden select-none">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl" />

          {/* Card Top */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xs">
                B
              </div>
              <span className="font-bold text-sm tracking-tight">BugarKu ID</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-200 uppercase tracking-widest">
              Laporan Harian
            </span>
          </div>

          {/* User Name & Streak badge */}
          <div className="space-y-1 mb-6">
            <span className="text-xs text-emerald-200 font-medium">Dedikasi {userName}</span>
            <div className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <span>{streakDays} Hari</span>
              <Flame className="w-7 h-7 text-amber-300 fill-amber-300 animate-pulse" />
            </div>
            <p className="text-xs text-emerald-100/80">Streak Latihan Berturut-Turut</p>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-xs">
            <div>
              <span className="text-emerald-200 text-[10px] block">Total Terbakar</span>
              <span className="text-lg font-bold font-mono tabular-nums">{totalCaloriesBurned} kcal</span>
            </div>
            <div>
              <span className="text-emerald-200 text-[10px] block">Sesi Selesai</span>
              <span className="text-lg font-bold font-mono tabular-nums">{totalWorkouts} Sesi</span>
            </div>
          </div>

          {/* Card Bottom Quote */}
          <p className="text-[10px] text-emerald-100/70 text-center mt-5 italic">
            "Disiplin adalah jembatan antara tujuan dan pencapaian nyata."
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 text-xs">
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{shared ? 'Tautan Dibagikan!' : 'Bagikan ke WhatsApp / IG / Medsos'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Teks Berhasil Disalin!' : 'Salin Teks Ringkasan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
